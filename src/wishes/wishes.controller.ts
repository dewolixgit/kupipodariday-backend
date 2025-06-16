import { Controller, Get } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishPublicDto } from './dto/wish-public.dto';
import { plainToInstance } from 'class-transformer';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

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
}
