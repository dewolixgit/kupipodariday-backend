import { Expose, Type } from 'class-transformer';
import { UserPublicDto } from '../../users/dto/user-public.dto';
import { WishPartialDto } from '../../wishes/dto/wish-partial.dto';

export class WishlistDetailDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() image: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => UserPublicDto)
  owner: UserPublicDto;

  @Expose()
  @Type(() => WishPartialDto)
  items: WishPartialDto[];
}
