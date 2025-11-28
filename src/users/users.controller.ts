import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateMealTimeDto } from './dto/create-mealtime.dto';
import { MealTimeService } from './mealtime.service';
import { UpdateMealTimeDto } from './dto/update-mealtime.dto';
import { UpdateTimeZoneDto } from './dto/update-timezone.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mealTimeService: MealTimeService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.getPublicProfile(req.user.id);
  }

  @Post('mealTime')
  async createMealtime(
    @Req() req,
    @Body() createMealTimeDto: CreateMealTimeDto,
  ) {
    return await this.mealTimeService.createMealTime(
      req.user.id,
      createMealTimeDto,
    );
  }

  @Get('mealTime')
  async getMealTime(@Req() req) {
    return await this.mealTimeService.getMealTime(req.user.id);
  }

  @Patch('mealTime')
  async updateMealTime(
    @Req() req,
    @Body() updateMealTimeDto: UpdateMealTimeDto,
  ) {
    return await this.mealTimeService.updateMealTime(
      req.user.id,
      updateMealTimeDto,
    );
  }

  @Patch('timezone')
  async timezone(@Req() req, @Body() updateTimezoneDto: UpdateTimeZoneDto) {
    return await this.mealTimeService.timezone(req.user.id, updateTimezoneDto);
  }
}
