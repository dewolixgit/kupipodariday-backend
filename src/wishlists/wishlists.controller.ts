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

@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly listsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listsService.findOne(id);
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
    return this.listsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    return this.listsService.remove(id, user.id);
  }
}
