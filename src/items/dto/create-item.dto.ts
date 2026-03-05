import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MaxLength(70)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @Type(() => Date)
  @IsDate()
  expiryDate: Date;

  @IsOptional()
  @IsBoolean()
  consumed?: boolean;
}
