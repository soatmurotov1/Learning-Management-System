import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [ModulesModule, PrismaModule, RedisModule, VerificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
