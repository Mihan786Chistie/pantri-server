import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { Job } from "bullmq";


@Processor('expired-items-cleanup', {
    lockDuration: 60000,
    removeOnComplete: {
        age: 60 * 60,
        count: 100
    }
})
export class ItemsConsumer extends WorkerHost {
    private readonly logger = new Logger(ItemsConsumer.name);

    constructor(
        private readonly itemsService: ItemsService,
    ) {
        super();
    }

    private maskId(id: string) {
        if (!id) return 'UNKNOWN';
        return `*****${id.slice(-4)}`;
    }

    async process(job: Job<{ userId: string }>) {
        try {
            this.logger.debug(`Processing user ${this.maskId(job.data.userId)}`);
            await this.itemsService.cleanupExpiredItems(job.data.userId);
        } catch (error) {
            this.logger.error(`Failed to process expired items for user ${this.maskId(job.data.userId)}`, error.stack);
        }
    }
}