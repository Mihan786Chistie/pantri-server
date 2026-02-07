import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { CerebrasClient } from './cerebras.client';
import { Ai } from './entities/ai.entity';
import { BullModule } from '@nestjs/bullmq';
import { AiConsumer } from './ai.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Item, Ai]),
    BullModule.registerQueue({
      name: 'ai-notifications',
    }),
  ],
  providers: [AiService, CerebrasClient, AiConsumer],
  exports: [AiService, BullModule]
})
export class AiModule { }
