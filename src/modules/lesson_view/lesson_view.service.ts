import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonViewDto } from './dto/create-lesson_view.dto';
import { UpdateLessonViewDto } from './dto/update-lesson_view.dto';

@Injectable()
export class LessonViewService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateLessonViewDto) {
    return this.prisma.lessonView.create({
      data: {
        lessonId: dto.lessonId,
        userId: dto.userId,
        view: dto.view,
      },
    });
  }

  findAll() {
    return this.prisma.lessonView.findMany({
      include: {
        lesson: true,
        user: true,
      },
    });
  }
  async findOne(lessonId: string, userId: string) {
    const view = await this.prisma.lessonView.findUnique({
      where: {
        lessonId_userId: {
          lessonId,
          userId,
        },
      },
    });

    if (!view) throw new NotFoundException('LessonView not found');
    return view;
  }

  update(lessonId: string, userId: string, dto: UpdateLessonViewDto) {
    return this.prisma.lessonView.update({
      where: {
        lessonId_userId: {
          lessonId,
          userId,
        },
      },
      data: dto,
    });
  }

  remove(lessonId: string, userId: string) {
    return this.prisma.lessonView.delete({
      where: {
        lessonId_userId: {
          lessonId,
          userId,
        },
      },
    });
  }
}
