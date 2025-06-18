import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishPublicDto } from './dto/wish-public.dto';
import { plainToInstance } from 'class-transformer';
import { CreateWishDto } from './dto/create-wish.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishDetailDto } from './dto/wish-detail.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWishDto, @CurrentUser() user) {
    return this.wishesService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishDto,
    @CurrentUser() user,
  ) {
    return this.wishesService.update(id, dto, user.id);
  }

  @Get('last')
  async findLast(): Promise<WishPublicDto[]> {
    const wishes = await this.wishesService.findLast();
    return plainToInstance(WishPublicDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @Get('top')
  async findTop(): Promise<WishPublicDto[]> {
    const wishes = await this.wishesService.findTop();
    return plainToInstance(WishPublicDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ): Promise<WishDetailDto> {
    const wish = await this.wishesService.findOneWithOffers(id, user.id);
    return plainToInstance(WishDetailDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  async copyWish(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const newWish = await this.wishesService.copyWish(id, user.id);
    return plainToInstance(WishDetailDto, newWish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    return this.wishesService.removeOne(id, user.id);
  }
}
