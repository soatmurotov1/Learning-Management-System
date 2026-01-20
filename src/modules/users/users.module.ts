import { Module } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { SmsService } from 'src/common/services/sms.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { VericationModule } from '../verication/verication.module';

@Module({
  imports: [
    ConfigModule,
    VericationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    RedisService,
    SmsService,
    ConfigService,
  ],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}
