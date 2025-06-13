import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
