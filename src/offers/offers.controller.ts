import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateOfferDto } from './dto/create-offer.dto';
import { plainToInstance } from 'class-transformer';
import { OfferPublicDto } from './dto/offer-public.dto';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOfferDto, @CurrentUser() user) {
    const offer = await this.offersService.create(dto, user.id);
    return plainToInstance(OfferPublicDto, offer, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    return plainToInstance(OfferPublicDto, offers, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne(id);
    return plainToInstance(OfferPublicDto, offer, {
      excludeExtraneousValues: true,
    });
  }
}
