import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { MealTime } from '../users/entities/mealtime.entity';
import { Ai } from '../ai/entities/ai.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Item, MealTime, Ai])],
    controllers: [SyncController],
    providers: [SyncService],
})
export class SyncModule { }
