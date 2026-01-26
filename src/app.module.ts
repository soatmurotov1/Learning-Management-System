import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { VericationModule } from './modules/verication/verication.module';
import { PurchasedCourseModule } from './modules/purchased_course/purchased_course.module';

@Module({
  imports: [
    ModulesModule, 
    PrismaModule, 
    RedisModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    VericationModule, 
    PurchasedCourseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}