import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { AiModule } from 'src/ai/ai.module';
import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AiModule,
    ItemsModule,
    UsersModule,
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule { }
