import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private listsRepo: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepo: Repository<Wish>,
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

  async create(dto: CreateWishlistDto, ownerId: number) {
    if (!dto.itemsId?.length) {
      throw new BadRequestException(ERROR_MESSAGES.wishIdsEmpty);
    }

    const items = await this.wishesRepo.find({
      where: { id: In(dto.itemsId) },
    });
    const wishlist = this.listsRepo.create({
      name: dto.name,
      image: dto.image,
      owner: { id: ownerId },
      description: '',
      items,
    });
    return this.listsRepo.save(wishlist);
  }

  async update(id: number, dto: UpdateWishlistDto, ownerId: number) {
    const list = await this.listsRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!list) throw new NotFoundException(ERROR_MESSAGES.wishlistNotFound);
    if (list.owner.id !== ownerId) {
      throw new ForbiddenException(ERROR_MESSAGES.wishlistEditForbidden);
    }

    if (dto.itemsId) {
      if (!dto.itemsId.length) {
        throw new BadRequestException(ERROR_MESSAGES.wishIdsEmpty);
      }

      const items = await this.wishesRepo.find({
        where: { id: In(dto.itemsId) },
      });

      list.items = items;
    }

    if (dto.name) list.name = dto.name;
    if (dto.image) list.image = dto.image;

    return this.listsRepo.save(list);
  }

  async remove(id: number, ownerId: number) {
    const list = await this.listsRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!list) throw new NotFoundException(ERROR_MESSAGES.wishlistNotFound);
    if (list.owner.id !== ownerId) {
      throw new ForbiddenException(ERROR_MESSAGES.wishlistDeleteForbidden);
    }

    await this.listsRepo.delete(id);
    return { message: SUCCESS_MESSAGES.wishlistDeleted };
  }
}
