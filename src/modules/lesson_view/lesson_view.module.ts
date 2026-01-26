import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LessonViewController } from './lesson_view.controller';
import { LessonViewService } from './lesson_view.service';

@Module({
  controllers: [LessonViewController],
  providers: [LessonViewService, PrismaService],
})
export class LessonViewModule {}
