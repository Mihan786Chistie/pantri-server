import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTimeZoneDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  timezoneOffset?: number;
}
