import { Module } from '@nestjs/common';
import { LessonGroupService } from './lesson_group.service';
import { LessonGroupController } from './lesson_group.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LessonGroupController],
  providers: [LessonGroupService],
  exports: [LessonGroupService]
})
export class LessonGroupModule {}
