import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonGroupDto } from './dto/create-lesson_group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson_group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonGroupService {
  constructor(private prisma: PrismaService) {}
  async create(createLessonGroupDto: CreateLessonGroupDto) {
    const lessonGroup = await this.prisma.lessonGroup.create({
      data: {
        name: createLessonGroupDto.name,
        courseId: createLessonGroupDto.courseId
      },
      include: {
        course: true,
        lessons: true,
        exams: true,
        
      }
    })
    return lessonGroup
  }
  async findAll() {
    const lessonGroups = await this.prisma.lessonGroup.findMany({
      include: {
        course: true,
        lessons: true,
        exams: true
      }
    })
    return lessonGroups
  }

  async findOne(id: number) {
    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id },
      include: {
        course: true,
        lessons: true,
        exams: true
      }
    })
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroupId id ${id} topilmadi`)
    }
    return lessonGroup
  }

  async update(id: number, updateLessonGroupDto: UpdateLessonGroupDto) {
    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id }
    })
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroupId ${id} topilmadi`)
    }

    const updatedLesson = await this.prisma.lessonGroup.update({
      where: { id },
      data: {
        name: updateLessonGroupDto.name || lessonGroup.name,
        courseId: updateLessonGroupDto.courseId || lessonGroup.courseId
      },
      include: {
        course: true,
        lessons: true,
        exams: true
      }
    })
    return updatedLesson
  }

  async remove(id: number) {
    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id }
    })
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroupId id ${id} topilmadi`);
    }

    const deleteLesson = await this.prisma.lessonGroup.delete({
      where: { id },
      include: {
        course: true
      }
    })
    return deleteLesson
  }
}
