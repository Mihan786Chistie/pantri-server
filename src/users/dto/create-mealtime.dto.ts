import { Type } from 'class-transformer';
import { IsMilitaryTime, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMealTimeDto {
  @IsOptional()
  @IsMilitaryTime()
  breakfast?: string;

  @IsOptional()
  @IsMilitaryTime()
  lunch?: string;

  @IsOptional()
  @IsMilitaryTime()
  snacks?: string;

  @IsOptional()
  @IsMilitaryTime()
  dinner?: string;

  @Type(() => Number)
  @IsNumber()
  timezoneOffset: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
