import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealTime } from './entities/mealtime.entity';
import { Repository } from 'typeorm';
import { CreateMealTimeDto } from './dto/create-mealtime.dto';
import { DEFAULT_MEALTIME } from './constants';
import { User } from './entities/user.entity';
import { UpdateMealTimeDto } from './dto/update-mealtime.dto';
import { UpdateTimeZoneDto } from './dto/update-timezone.dto';

@Injectable()
export class MealTimeService {
  constructor(
    @InjectRepository(MealTime)
    private mealTimeRepository: Repository<MealTime>,
  ) {}

  async createMealTime(user: User, createMealTimeDto: CreateMealTimeDto) {
    const mealTime = this.mealTimeRepository.create({
      user,
      ...createMealTimeDto,
      ...DEFAULT_MEALTIME,
    });

    return await this.mealTimeRepository.save(mealTime);
  }

  async getMealTime(userId: number) {
    return await this.mealTimeRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async updateMealTime(userId: number, updateMealTimeDto: UpdateMealTimeDto) {
    const mealTime = await this.getMealTime(userId);

    if (!mealTime) throw new NotFoundException(`MealTime not found`);
    Object.assign(mealTime, updateMealTimeDto);
    return await this.mealTimeRepository.save(mealTime);
  }

  async timezone(userId: number, updateTimezoneDto: UpdateTimeZoneDto) {
    const mealTime = await this.getMealTime(userId);
    if (!mealTime) {
      throw new NotFoundException(`MealTime not found`);
    }
    mealTime.timezoneOffset = updateTimezoneDto.timezoneOffset;
    return this.mealTimeRepository.save(mealTime);
  }
}
