import { Expose, Type } from 'class-transformer';
import { OfferPublicDto } from '../../offers/dto/offer-public.dto';
import { UserPublicDto } from '../../users/dto/user-public.dto';

export class WishDetailDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() link: string;
  @Expose() image: string;
  @Expose() price: number;
  @Expose() raised: number;
  @Expose() copied: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => UserPublicDto)
  owner: UserPublicDto;

  @Expose()
  @Type(() => OfferPublicDto)
  offers: OfferPublicDto[];
}
