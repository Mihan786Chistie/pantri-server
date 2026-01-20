import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Ai } from './entities/ai.entity';
import { Item } from 'src/items/entities/item.entity';
import { CerebrasClient } from './cerebras.client';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Ai) private aiRepository: Repository<Ai>,
        private cerebrasClient: CerebrasClient,
    ) { }

    async generateAiNotifications(userId: string) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            const items = await this.itemRepository.find({ where: { user: { id: userId }, consumed: false } });

            if (items.length === 0) {
                this.logger.log(`User ${userId} has no items, skipping AI generation`);
                return [];
            }

            const existingAi = await this.aiRepository.findOne({
                where: { user: { id: userId } }
            });

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const threeDaysFromNow = new Date(today);
            threeDaysFromNow.setDate(today.getDate() + 3);

            const urgentItems = items.filter(item => {
                const expiryDate = new Date(item.expiryDate);
                return expiryDate <= threeDaysFromNow && expiryDate >= today;
            });

            const urgentItemsStr = urgentItems.map(item => `${item.name} (${item.expiryDate})`).join(', ');

            const historyStr = existingAi?.notifications
                ? existingAi.notifications.map(n => n.notification).join('\n')
                : "None";

            const input = `
            Today's Date: ${todayStr}
            User: ${user?.id}, Name: ${user?.name}

            URGENT - MUST USE (Expiring Soon): 
            ${urgentItemsStr || "None"}

            Recent Meal History (For Variety - Avoid repeating unless item is URGENT):
            ${historyStr}

            Items available:
            ${items.map((item) => `Id: ${item.id}, Name: ${item.name}, Category: ${item.category}, Expiry Date: ${item.expiryDate}, Consumed: ${item.consumed}`).join('\n')}
            `;

            const response = await this.cerebrasClient.generateAiNotifications(input);

            let result;
            try {
                result = JSON.parse((response as any).choices[0].message.content as string);
            } catch (parseError) {
                this.logger.error(`Failed to parse AI response for user ${userId}`, parseError);
                throw new Error('Invalid AI response format');
            }

            if (existingAi) {
                existingAi.notifications = result.notifications;
                await this.aiRepository.save(existingAi);
            } else {
                await this.aiRepository.save({
                    user: { id: userId },
                    notifications: result.notifications,
                });
            }

            this.logger.log(`Successfully generated notifications for user ${userId}`);
            return result.notifications;

        } catch (error) {
            this.logger.error(`Error generating AI notifications for user ${userId}`, error.stack);
            throw error;
        }
    }

    async getAiNotifications(userId: string) {
        const ai = await this.aiRepository.findOne({
            where: { user: { id: userId } }
        });
        return ai?.notifications || [];
    }
}