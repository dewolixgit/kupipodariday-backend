import {
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId?: number[];
}
