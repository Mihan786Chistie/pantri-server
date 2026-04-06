import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Get()
    async pullChanges(
        @Req() req,
        @Query('last_pulled_at') lastPulledAt: string,
        @Query('schema_version') schemaVersion: string,
        @Query('migration') migration: string,
    ) {
        const pulledAtTimestamp = lastPulledAt === 'null' || !lastPulledAt ? 0 : Number(lastPulledAt);

        const result = await this.syncService.pullChanges(
            req.user.id,
            pulledAtTimestamp,
        );

        return result;
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async pushChanges(
        @Req() req,
        @Query('last_pulled_at') lastPulledAt: string,
        @Body('changes') changes: any,
    ) {
        const pulledAtTimestamp = lastPulledAt === 'null' || !lastPulledAt ? 0 : Number(lastPulledAt);

        await this.syncService.pushChanges(req.user.id, changes, pulledAtTimestamp);

        return { success: true };
    }
}
