import { IsMilitaryTime, IsOptional } from 'class-validator';

export class UpdateMealTimeDto {
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
}
