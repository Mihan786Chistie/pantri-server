import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDate()
  expiryDate: Date;

  @IsBoolean()
  consumed: boolean;
}
