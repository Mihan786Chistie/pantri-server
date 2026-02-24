import { BullQueueProcessor, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AiService } from './ai.service';

@Processor('ai-notifications', {
    lockDuration: 300000,
    maxStalledCount: 1,
    stalledInterval: 30000,
    removeOnComplete: {
        age: 60 * 60,
        count: 100
    }
})
export class AiConsumer extends WorkerHost {
    private readonly logger = new Logger(AiConsumer.name);

    constructor(private readonly aiService: AiService) {
        super();
    }

    private maskId(id: string) {
        if (!id) return 'UNKNOWN';
        return `*****${id.slice(-4)}`;
    }

    async process(job: Job<{ userId: string }>): Promise<any> {
        this.logger.debug(`Processing job ${job.id} for user ${this.maskId(job.data.userId)}`);
        try {
            await this.aiService.generateAiNotifications(job.data.userId);
            this.logger.debug(`Job ${job.id} completed`);
        } catch (error) {
            this.logger.error(`Job ${job.id} failed`, error.stack);
            throw error;
        }
    }
}
