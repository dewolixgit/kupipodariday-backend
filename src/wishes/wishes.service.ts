import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepo: Repository<Wish>,
    private dataSource: DataSource,
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
      owner: { id: ownerId },
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

  async copyWish(sourceId: number, userId: number) {
    const source = await this.wishesRepo.findOne({
      where: { id: sourceId },
      relations: ['owner'],
    });

    if (!source) {
      throw new NotFoundException(ERROR_MESSAGES.wishNotFound);
    }

    return this.dataSource.transaction(async (manager) => {
      await manager.increment(Wish, { id: sourceId }, 'copied', 1);

      const clone = manager.create(Wish, {
        name: source.name,
        link: source.link,
        image: source.image,
        price: source.price,
        description: source.description,
        owner: { id: userId },
        raised: 0,
        copied: 0,
      });
      return manager.save(clone);
    });
  }

  async removeOne(id: number, currentUserId: number) {
    const wish = await this.wishesRepo.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) throw new NotFoundException();

    if (wish.owner.id !== currentUserId) {
      throw new ForbiddenException(ERROR_MESSAGES.wishDeleteForbidden);
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException(ERROR_MESSAGES.wishHasOffers);
    }

    await this.wishesRepo.delete(id);
    return { message: SUCCESS_MESSAGES.wishDeleted };
  }
}
