import { Module } from '@nestjs/common';
import { AssignedCourseService } from './assigned_course.service';
import { AssignedCourseController } from './assigned_course.controller';

@Module({
  controllers: [AssignedCourseController],
  providers: [AssignedCourseService],
})
export class AssignedCourseModule {}
