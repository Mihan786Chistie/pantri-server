import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MealTimeService } from './mealtime.service';
import { MealTime } from './entities/mealtime.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([MealTime]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MealTimeService],
})
export class UsersModule {}
