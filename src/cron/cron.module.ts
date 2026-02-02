import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Ai } from 'src/ai/entities/ai.entity';
import { User } from 'src/users/entities/user.entity';
import { MealTimeService } from 'src/users/mealtime.service';
import { MealTime } from 'src/users/entities/mealtime.entity';
import { ItemsService } from 'src/items/items.service';
import { AiService } from 'src/ai/ai.service';
import { CerebrasClient } from 'src/ai/cerebras.client';

@Module({
  providers: [CronService, MealTimeService, ItemsService, AiService, CerebrasClient],
  imports: [TypeOrmModule.forFeature([Item, Ai, User, MealTime])],
  exports: [CronService],
})
export class CronModule { }
