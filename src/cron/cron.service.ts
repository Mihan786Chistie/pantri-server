import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AiService } from 'src/ai/ai.service';
import { ItemsService } from 'src/items/items.service';
import { MealTimeService } from 'src/users/mealtime.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly mealTimeService: MealTimeService,
        private readonly itemsService: ItemsService,
        private readonly aiService: AiService,
    ) { }

    private timeFormatter(timezone: string) {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone,
        });
    }

    private maskId(id: string) {
        if (!id) return 'UNKNOWN';
        return `*****${id.slice(-4)}`;
    }

    @Cron('0 * * * *')
    async handleCron() {
        try {
            const mealTimes = await this.mealTimeService.getDistinctTimezone();
            const targetTimezones: string[] = [];

            mealTimes.forEach((mealTime) => {
                if (!mealTime.timezone) return;
                try {
                    const formatter = this.timeFormatter(mealTime.timezone);
                    const currentHour = parseInt(formatter.format(new Date()), 10);

                    if (currentHour === 0 || currentHour === 24) {
                        targetTimezones.push(mealTime.timezone);
                    }
                } catch (error) {
                    this.logger.error(`Invalid timezone found: ${mealTime.timezone}`, error.stack);
                }
            });

            if (targetTimezones.length > 0) {
                this.logger.log(`Processing users in timezones: ${targetTimezones.join(', ')}`);
                const mealTimes = await this.mealTimeService.getMealTimeByTimezones(targetTimezones);

                for (const mealTime of mealTimes) {
                    try {
                        this.logger.debug(`Processing user ${this.maskId(mealTime.user.id)}`);
                        await this.itemsService.cleanupExpiredItems(mealTime.user.id);
                        await this.aiService.generateAiNotifications(mealTime.user.id);
                    } catch (error) {
                        this.logger.error(`Failed to process cron tasks for user ${this.maskId(mealTime.user.id)}`, error.stack);
                    }
                }
            }
        } catch (error) {
            this.logger.error('Critical error in CronService', error.stack);
        }
    }
}
