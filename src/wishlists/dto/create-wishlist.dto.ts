import {
  IsString,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
