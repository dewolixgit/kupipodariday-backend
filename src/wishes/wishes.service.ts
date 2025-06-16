import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ERROR_MESSAGES } from '../common/constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepo: Repository<Wish>,
  ) {}

  async findLast(): Promise<Wish[]> {
    return this.wishesRepo.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishesRepo.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner'],
    });
  }

  async create(dto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = this.wishesRepo.create({
      ...dto,
      raised: 0,
      copied: 0,
      owner: { id: ownerId } as any,
    });
    return this.wishesRepo.save(wish);
  }

  async update(id: number, dto: UpdateWishDto, userId: number): Promise<Wish> {
    const wish = await this.wishesRepo.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.wishNotFound);
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.wishEditForbidden);
    }

    if (dto.price !== undefined && wish.offers.length > 0) {
      throw new BadRequestException(ERROR_MESSAGES.priceChangeForbidden);
    }

    Object.assign(wish, dto);
    return this.wishesRepo.save(wish);
  }

  async findOneWithOffers(id: number, viewerId: number): Promise<Wish> {
    const wish = await this.wishesRepo.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.wishNotFound);
    }

    const isOwner = wish.owner.id === viewerId;

    if (!isOwner) {
      wish.offers = wish.offers.filter((o) => !o.hidden);
    }

    return wish;
  }
}
