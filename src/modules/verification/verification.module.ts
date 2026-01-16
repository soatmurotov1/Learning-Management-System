import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SmsService } from 'src/common/services/sms.service';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [VerificationController],
  providers: [VerificationService, SmsService],
})
export class VerificationModule {}
