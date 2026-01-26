import { Module } from '@nestjs/common';
import { PurchasedCourseService } from './purchased_course.service';
import { PurchasedCourseController } from './purchased_course.controller';

@Module({
  controllers: [PurchasedCourseController],
  providers: [PurchasedCourseService]
})
export class PurchasedCourseModule {}