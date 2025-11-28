import { IsBoolean } from 'class-validator';

export class UpdateItemDto {
  @IsBoolean()
  consumed: boolean;
}
