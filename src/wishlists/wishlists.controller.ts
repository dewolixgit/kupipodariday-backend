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
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { plainToInstance } from 'class-transformer';
import { WishlistDetailDto } from './dto/wishlist-detail.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly listsService: WishlistsService) {}

  @Get()
  async findAll() {
    const lists = await this.listsService.findAll();

    return plainToInstance(WishlistDetailDto, lists, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const list = await this.listsService.findOne(id);

    return plainToInstance(WishlistDetailDto, list, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateWishlistDto, @CurrentUser() user) {
    return this.listsService.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishlistDto,
    @CurrentUser() user,
  ) {
    const list = this.listsService.update(id, dto, user.id);

    return plainToInstance(WishlistDetailDto, list, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    return this.listsService.remove(id, user.id);
  }
}
