import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ERROR_MESSAGES } from '../common/constants';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepo: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepo: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateOfferDto, userId: number) {
    const wish = await this.wishesRepo.findOne({
      where: { id: dto.itemId },
      relations: ['owner'],
    });

    if (!wish) throw new NotFoundException(ERROR_MESSAGES.wishNotFound);

    if (wish.owner.id === userId) {
      throw new ForbiddenException(ERROR_MESSAGES.ownOfferForbidden);
    }

    const rest = wish.price - wish.raised;

    if (rest <= 0) {
      throw new BadRequestException(ERROR_MESSAGES.wishIsFullyFunded);
    }

    if (dto.amount > rest) {
      throw new BadRequestException(ERROR_MESSAGES.amountTooBig);
    }

    return this.dataSource.transaction(async (manager) => {
      const offer = manager.create(Offer, {
        amount: dto.amount,
        hidden: dto.hidden,
        item: { id: dto.itemId },
        user: { id: userId },
      });

      await manager.save(offer);

      await manager.increment(Wish, { id: dto.itemId }, 'raised', dto.amount);

      return offer;
    });
  }

  findAll() {
    return this.offersRepo.find({ relations: ['item', 'user'] });
  }

  async findOne(id: number) {
    const offer = await this.offersRepo.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException(ERROR_MESSAGES.offerNotFound);
    }

    return offer;
  }
}
