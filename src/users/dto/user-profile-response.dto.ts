import { Expose } from 'class-transformer';

export class UserProfileResponseDto {
  @Expose() id: number;
  @Expose() username: string;
  @Expose() about: string;
  @Expose() avatar: string;
  @Expose() email: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
