import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { ENV_KEYS } from './common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(ENV_KEYS.dbHost) ?? 'localhost',
        port: Number(configService.get(ENV_KEYS.dbPort) ?? 5432),
        username: configService.get(ENV_KEYS.dbUser) ?? 'student',
        password: configService.get(ENV_KEYS.dbPass) ?? 'student',
        database: configService.get(ENV_KEYS.dbName) ?? 'kupipodariday',
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WishesModule,
    AuthModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
