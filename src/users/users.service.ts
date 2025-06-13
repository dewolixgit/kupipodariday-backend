import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { ENV_KEYS, ERROR_MESSAGES } from '../common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, username, password, about, avatar } = dto;

    const existing = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.userAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(this.configService.get(ENV_KEYS.bcryptSaltRounds) ?? 10),
    );

    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      about,
      avatar,
    });

    const saved = await this.usersRepository.save(user);
    const { password: _, ...returnUserFields } = saved;
    return returnUserFields;
  }
}
