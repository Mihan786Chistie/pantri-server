import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { MealTime } from '../users/entities/mealtime.entity';
import { Ai } from '../ai/entities/ai.entity';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(
        @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
        @InjectRepository(MealTime) private readonly mealTimeRepository: Repository<MealTime>,
        @InjectRepository(Ai) private readonly aiRepository: Repository<Ai>,
        private readonly dataSource: DataSource,
    ) { }

    async pullChanges(userId: string, lastPulledAt: number | null) {

        const lastPulledDate = lastPulledAt
            ? new Date(lastPulledAt)
            : new Date(0);
        const timestamp = await this.getDatabaseTime();

        const [
            createdItems,
            updatedItems,
            deletedItems,
            createdMeals,
            updatedMeals,
            createdAis,
            updatedAis,
        ] = await Promise.all([

            this.itemRepository.createQueryBuilder('item')
                .where('item.userId = :userId', { userId })
                .andWhere('item.createdAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .andWhere('item.createdAt < to_timestamp(:timestampMs / 1000.0)', { timestampMs: timestamp })
                .getMany(),

            this.itemRepository.createQueryBuilder('item')
                .where('item.userId = :userId', { userId })
                .andWhere('item.updatedAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .andWhere('item.createdAt < to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .getMany(),

            this.itemRepository.createQueryBuilder('item')
                .withDeleted()
                .where('item.userId = :userId', { userId })
                .andWhere('item.deletedAt IS NOT NULL')
                .andWhere('item.deletedAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .getMany(),

            this.mealTimeRepository.createQueryBuilder('meal')
                .where('meal.userId = :userId', { userId })
                .andWhere('meal.createdAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .getMany(),

            this.mealTimeRepository.createQueryBuilder('meal')
                .where('meal.userId = :userId', { userId })
                .andWhere('meal.updatedAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .andWhere('meal.createdAt < to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .getMany(),

            this.aiRepository.createQueryBuilder('ai')
                .where('ai.userId = :userId', { userId })
                .andWhere('ai.createdAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .getMany(),

            this.aiRepository.createQueryBuilder('ai')
                .where('ai.userId = :userId', { userId })
                .andWhere('ai.updatedAt > to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .andWhere('ai.createdAt < to_timestamp(:lastPulledMs / 1000.0)', { lastPulledMs: lastPulledDate.getTime() })
                .getMany(),
        ]);

        this.logger.debug(
            `Pull sync for user ${userId}`,
        );

        return {
            changes: {
                items: {
                    created: [],
                    updated: [...createdItems, ...updatedItems].map(item => this.mapItem(item)),
                    deleted: deletedItems.map(i => i.id),
                },
                meal_times: {
                    created: [],
                    updated: [...createdMeals, ...updatedMeals].map(meal => this.mapMealTime(meal)),
                    deleted: [],
                },
                ai_notifications: {
                    created: [],
                    updated: [...createdAis, ...updatedAis].map(ai => this.mapAi(ai)),
                    deleted: [],
                },
            },
            timestamp,
        };
    }

    async pushChanges(userId: string, changes: any, lastPulledAt: number) {

        this.logger.debug(`Push sync for user ${userId}`);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            if (changes?.items) {

                for (const raw of changes.items.created ?? []) {
                    if (!this.isUUID(raw.id)) continue;

                    const existing = await queryRunner.manager.findOne(Item, {
                        where: { id: raw.id, userId },
                    });

                    if (!existing) {
                        const item = queryRunner.manager.create(Item, {
                            id: raw.id,
                            name: raw.name,
                            category: raw.category,
                            expiryDate: new Date(raw.expires_at),
                            consumed: raw.is_consumed,
                            userId,
                        });

                        await queryRunner.manager.insert(Item, item);
                    }
                }

                for (const raw of changes.items.updated ?? []) {
                    if (!this.isUUID(raw.id)) continue;

                    const existing = await queryRunner.manager.findOne(Item, {
                        where: { id: raw.id, userId },
                    });

                    if (existing) {
                        this.ensureNoConflict(existing.updatedAt, lastPulledAt, `item ${raw.id}`);
                        await queryRunner.manager.update(
                            Item,
                            { id: raw.id, userId },
                            {
                                name: raw.name,
                                category: raw.category,
                                expiryDate: new Date(raw.expires_at),
                                consumed: raw.is_consumed,
                            },
                        );
                    } else {
                        const item = queryRunner.manager.create(Item, {
                            id: raw.id,
                            name: raw.name,
                            category: raw.category,
                            expiryDate: new Date(raw.expires_at),
                            consumed: raw.is_consumed,
                            userId,
                        });
                        await queryRunner.manager.insert(Item, item);
                    }
                }

                for (const id of changes.items.deleted ?? []) {
                    if (!this.isUUID(id)) continue;
                    await queryRunner.manager.softDelete(Item, { id, userId });
                }
            }

            await queryRunner.commitTransaction();

        } catch (e) {

            await queryRunner.rollbackTransaction();

            throw new BadRequestException(
                'Sync push failed: ' + e.message,
            );

        } finally {

            await queryRunner.release();

        }
    }

    private async getDatabaseTime(): Promise<number> {
        const result = await this.dataSource.query(`SELECT NOW() as now`);
        return new Date(result[0].now).getTime();
    }

    private mapItem(item: Item) {
        return {
            id: item.id,
            name: item.name,
            category: item.category,
            expires_at: new Date(item.expiryDate).getTime(),
            is_consumed: item.consumed,
            user_id: item.userId,
            created_at: new Date(item.createdAt).getTime(),
            updated_at: new Date(item.updatedAt).getTime(),
        };
    }

    private mapMealTime(meal: MealTime) {
        return {
            id: meal.id,
            breakfast: meal.breakfast,
            lunch: meal.lunch,
            snacks: meal.snacks,
            dinner: meal.dinner,
            timezone_offset: meal.timezoneOffset,
            timezone: meal.timezone,
            user_id: meal.userId,
            created_at: new Date(meal.createdAt).getTime(),
            updated_at: new Date(meal.updatedAt).getTime(),
        };
    }

    private mapAi(ai: Ai) {
        return {
            id: ai.id,
            notifications: JSON.stringify(ai.notifications ?? []),
            user_id: ai.userId,
            created_at: new Date(ai.createdAt).getTime(),
            updated_at: new Date(ai.updatedAt).getTime(),
        };
    }

    private ensureNoConflict(entityUpdatedAt: Date, lastPulledAt: number, name: string) {
        if (entityUpdatedAt.getTime() > lastPulledAt) {
            throw new BadRequestException(`Conflict detected for ${name}`);
        }
    }

    private isUUID(id: string): boolean {
        return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    }
}