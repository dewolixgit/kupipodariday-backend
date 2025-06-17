import { Expose, Type } from 'class-transformer';
import { OfferPublicDto } from '../../offers/dto/offer-public.dto';

export class UserWishDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() link: string;
  @Expose() image: string;
  @Expose() price: number;
  @Expose() raised: number;
  @Expose() copied: number;
  @Expose() description: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => OfferPublicDto)
  offers: OfferPublicDto[];
}
