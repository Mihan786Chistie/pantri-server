import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMealTimeDto {
  @IsString()
  breakfast?: string;

  @IsString()
  lunch?: string;

  @IsString()
  snacks?: string;

  @IsString()
  dinner?: string;

  @IsOptional()
  @IsNumber()
  timezoneOffset?: number;
}
