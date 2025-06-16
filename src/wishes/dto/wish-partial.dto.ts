import { Expose } from 'class-transformer';
import { UserPublicDto } from '../../users/dto/user-public.dto';
import { Type } from 'class-transformer';

export class WishPartialDto {
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
  @Type(() => UserPublicDto)
  owner: UserPublicDto;
}
