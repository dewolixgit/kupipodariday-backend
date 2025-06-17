import {
  Controller,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPublicProfileDto } from './dto/user-public-profile.dto';
import { plainToInstance } from 'class-transformer';
import { UserWishDto } from '../wishes/dto/user-wish.dto';
import { FindUsersDto } from './dto/find-users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  update(@Body() dto: UpdateUserDto, @CurrentUser() user) {
    return this.usersService.update(user.id, dto);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findPublicProfile(username);
    return plainToInstance(UserPublicProfileDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string, @CurrentUser() viewer) {
    const wishes = await this.usersService.findUserWishes(username, viewer.id);
    return plainToInstance(UserWishDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @Post('find')
  @HttpCode(HttpStatus.CREATED)
  async findMany(@Body() dto: FindUsersDto) {
    const users = await this.usersService.findMany(dto.query);
    return plainToInstance(UserPublicProfileDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
