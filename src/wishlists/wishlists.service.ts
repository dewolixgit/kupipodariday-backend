import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { ERROR_MESSAGES } from '../common/constants';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private listsRepo: Repository<Wishlist>,
  ) {}

  findAll() {
    return this.listsRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  async findOne(id: number) {
    const list = await this.listsRepo.findOne({
      where: { id },
      relations: ['owner', 'items', 'items.owner'],
    });

    if (!list) throw new NotFoundException(ERROR_MESSAGES.wishlistNotFound);

    return list;
  }
}
