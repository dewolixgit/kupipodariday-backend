import {
  IsOptional,
  IsString,
  Length,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional() @IsUrl() image?: string;
  @IsOptional() @IsUrl() link?: string;
}
