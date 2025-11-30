import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealTime } from './entities/mealtime.entity';
import { Repository } from 'typeorm';
import { CreateMealTimeDto } from './dto/create-mealtime.dto';
import { getDefaultMealTimesUTC } from './constants';
import { UpdateMealTimeDto } from './dto/update-mealtime.dto';

@Injectable()
export class MealTimeService {
  constructor(
    @InjectRepository(MealTime)
    private mealTimeRepository: Repository<MealTime>,
  ) {}

  async createMealTime(userId: string, createMealTimeDto: CreateMealTimeDto) {
    if (!createMealTimeDto.timezoneOffset)
      throw new NotFoundException('timezoneOffset not found');

    const UTC_DEFAULT_MEALTIME = getDefaultMealTimesUTC(
      createMealTimeDto.timezoneOffset,
    );

    const mealTime = this.mealTimeRepository.create({
      user: { id: userId },
      ...createMealTimeDto,
      ...UTC_DEFAULT_MEALTIME,
    });

    return await this.mealTimeRepository.save(mealTime);
  }

  async getMealTime(userId: string) {
    return await this.mealTimeRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async updateMealTime(userId: string, updateMealTimeDto: UpdateMealTimeDto) {
    const mealTime = await this.getMealTime(userId);

    if (!mealTime) throw new NotFoundException(`MealTime not found`);

    if (!updateMealTimeDto.timezoneOffset)
      throw new NotFoundException('timezoneOffset Not Found');

    const UTC_DEFAULT_MEALTIME = getDefaultMealTimesUTC(
      updateMealTimeDto.timezoneOffset,
    );

    Object.assign(mealTime, updateMealTimeDto, UTC_DEFAULT_MEALTIME);

    return await this.mealTimeRepository.save(mealTime);
  }
}
