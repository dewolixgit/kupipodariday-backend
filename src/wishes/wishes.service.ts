import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

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
}
