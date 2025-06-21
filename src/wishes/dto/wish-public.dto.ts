import { Expose, Type } from 'class-transformer';
import { UserPublicDto } from '../../users/dto/user-public.dto';

export class WishPublicDto {
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
