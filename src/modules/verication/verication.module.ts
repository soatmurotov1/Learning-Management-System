import { Module } from '@nestjs/common';
import { VericationController } from './verication.controller';
import { RedisModule } from 'src/common/redis/redis.module';
import { SmsService } from 'src/common/services/sms.service';
import { VericationService } from './verication.service';

@Module({
  imports: [RedisModule],
  controllers: [VericationController],
  providers: [VericationService, SmsService],
  exports: [VericationService],
})
export class VericationModule {}
