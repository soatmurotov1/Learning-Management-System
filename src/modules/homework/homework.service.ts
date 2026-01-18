import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeworkDto: CreateHomeworkDto, userId: number) {
    try {
      const homework = await this.prisma.homework.create({
        data: {
          task: createHomeworkDto.task,
          file: createHomeworkDto.file,
          lessonId: createHomeworkDto.lessonId,
        },
        include: {
          lesson: true,
        },
      });
      return homework;
    } catch (error) {
      throw new BadRequestException('Vazifani yaratishda xato yuz berdi');
    }
  }

  async findAll() {
    try {
      const homeworks = await this.prisma.homework.findMany({
        include: {
          lesson: true,
          submissions: true,
        },
      });
      return homeworks;
    } catch (error) {
      throw new BadRequestException('Vazifalarni olishda xato yuz berdi');
    }
  }

  async findOne(id: number) {
    try {
      const homework = await this.prisma.homework.findUnique({
        where: { id },
        include: {
          lesson: true,
          submissions: true,
        },
      });
      if (!homework) {
        throw new NotFoundException(`ID: ${id} vazifa topilmadi`);
      }
      return homework;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Vazifani olishda xato yuz berdi');
    }
  }

  async update(
    id: number,
    updateHomeworkDto: UpdateHomeworkDto,
    userId: number,
  ) {
    try {
      const homework = await this.prisma.homework.findUnique({
        where: { id },
      });
      if (!homework) {
        throw new NotFoundException(`ID: ${id} vazifa topilmadi`);
      }

      const updated = await this.prisma.homework.update({
        where: { id },
        data: {
          task: updateHomeworkDto.task || homework.task,
          file: updateHomeworkDto.file || homework.file,
          lessonId: updateHomeworkDto.lessonId || homework.lessonId,
          updatedAt: new Date(),
        },
        include: {
          lesson: true,
        },
      });
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Vazifani tahrirlashda xato yuz berdi');
    }
  }

  async remove(id: number, userId: number) {
    try {
      const homework = await this.prisma.homework.findUnique({
        where: { id },
      });
      if (!homework) {
        throw new NotFoundException(`ID: ${id} vazifa topilmadi`);
      }

      await this.prisma.homework.delete({
        where: { id },
      });
      return { message: `ID: ${id} vazifa o'chirildi` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Vazifani o'chirishda xato yuz berdi");
    }
  }
}
