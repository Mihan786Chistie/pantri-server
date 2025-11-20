import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTimeZoneDto {
  @IsOptional()
  @IsNumber()
  timezoneOffset?: number;
}
