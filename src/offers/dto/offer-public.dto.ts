import { Expose, Type } from 'class-transformer';
import { UserPublicDto } from '../../users/dto/user-public.dto';

export class OfferPublicDto {
  @Expose() id: number;
  @Expose() amount: number;
  @Expose() hidden: boolean;
  @Expose() createdAt: Date;

  @Expose()
  @Type(() => UserPublicDto)
  user: UserPublicDto;
}
