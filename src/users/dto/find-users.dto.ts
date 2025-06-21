import { IsString, Length } from 'class-validator';

export class FindUsersDto {
  @IsString()
  @Length(1, 64)
  query: string;
}
