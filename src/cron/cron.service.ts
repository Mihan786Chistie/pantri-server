import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MealTimeService } from 'src/users/mealtime.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly mealTimeService: MealTimeService,
        @InjectQueue('ai-notifications') private aiQueue: Queue,
        @InjectQueue('expired-items-cleanup') private itemsQueue: Queue,
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

    @Cron(CronExpression.EVERY_HOUR)
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
                        await this.itemsQueue.add('cleanup-expired-items', { userId: mealTime.user.id });
                        await this.aiQueue.add('generate-notifications', { userId: mealTime.user.id });
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
