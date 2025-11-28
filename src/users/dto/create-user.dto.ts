import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
