import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import {
  ENV_KEYS,
  ERROR_MESSAGES,
  POSTGRES_ERROR_CODE,
} from '../common/constants';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

const BCRYPT_SALT_ROUNDS_DEFAULT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findOwn(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getOwnWishes(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.user',
        'wishes.owner',
      ],
    });
    return user.wishes;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, username, password, about, avatar } = dto;

    const hashedPassword = await bcrypt.hash(
      password,
      Number(
        this.configService.get(ENV_KEYS.bcryptSaltRounds) ??
          BCRYPT_SALT_ROUNDS_DEFAULT,
      ),
    );

    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      about,
      avatar,
    });

    let saved: User;

    try {
      saved = await this.usersRepository.save(user);
    } catch (e: any) {
      if (e.code === POSTGRES_ERROR_CODE.uniqueViolation) {
        throw new ConflictException(ERROR_MESSAGES.userAlreadyExists);
      }

      throw e;
    }

    const { password: _, ...result } = saved;

    return result;
  }

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    if (dto.password) {
      const saltRounds = Number(
        this.configService.get(ENV_KEYS.bcryptSaltRounds) ??
          BCRYPT_SALT_ROUNDS_DEFAULT,
      );
      dto.password = await bcrypt.hash(dto.password, saltRounds);
    }

    Object.assign(user, dto);

    let updated: User;

    try {
      updated = await this.usersRepository.save(user);
    } catch (e: any) {
      if (e.code === POSTGRES_ERROR_CODE.uniqueViolation) {
        throw new ConflictException(ERROR_MESSAGES.userAlreadyExists);
      }
      throw e;
    }

    delete updated.password;
    delete updated.email;
    return updated;
  }

  async findPublicProfile(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException();

    return user;
  }

  async findUserWishes(username: string, viewerId: number) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.offers', 'wishes.offers.user'],
    });

    if (!user) throw new NotFoundException();

    const isOwner = user.id === viewerId;

    return user.wishes.map((w) => ({
      ...w,
      offers: w.offers
        .filter((o) => isOwner || !o.hidden)
        .map((o) => ({
          id: o.id,
          amount: !isOwner && o.hidden ? undefined : o.amount,
          hidden: o.hidden,
          createdAt: o.createdAt,
          user: o.user,
        })),
    }));
  }

  async findMany(search: string) {
    return this.usersRepository.find({
      where: [
        { username: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ],
    });
  }
}
