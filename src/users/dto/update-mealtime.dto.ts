import { IsString } from 'class-validator';

export class UpdateMealTimeDto {
  @IsString()
  breakfast?: string;

  @IsString()
  lunch?: string;

  @IsString()
  snacks?: string;

  @IsString()
  dinner?: string;
}
