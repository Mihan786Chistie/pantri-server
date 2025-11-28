import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @Type(() => Date)
  @IsDate()
  expiryDate: Date;

  @IsOptional()
  @IsBoolean()
  consumed?: boolean;
}
