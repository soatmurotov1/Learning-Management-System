import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CloudinaryUploadService } from 'src/common/cloudinary/cloudinary.upload';

@Injectable()
export class HomeworkService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryUploadService,
  ) {}

  async create(
    createHomeworkDto: CreateHomeworkDto,
    file: Express.Multer.File,
    userId: string
  ) {
    try {
      let fileUrl: any = null
      if (file) {
        const uploadedFile = await this.cloudinaryService.uploadFile(
          file,
          'homework',
        );
        fileUrl = uploadedFile.url;
      }
      const homework = await this.prisma.homework.create({
        data: {
          task: createHomeworkDto.task,
          file: fileUrl,
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

  async findOne(id: string) {
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
    id: string,
    updateHomeworkDto: UpdateHomeworkDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    try {
      const homework = await this.prisma.homework.findUnique({
        where: { id },
      });
      if (!homework) {
        throw new NotFoundException(`ID: ${id} vazifa topilmadi`);
      }

      let fileUrl: any = homework.file;
      if (file) {
        const uploadedFile = await this.cloudinaryService.uploadFile(
          file,
          'homework',
        );
        fileUrl = uploadedFile.url;
      }

      const updated = await this.prisma.homework.update({
        where: { id },
        data: {
          task: updateHomeworkDto.task || homework.task,
          file: fileUrl,
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

  async remove(id: string, userId: string) {
    try {
      const homework = await this.prisma.homework.findUnique({
        where: { id },
      });
      if (!homework) {
        throw new NotFoundException(`ID: ${id} vazifa topilmadi`);
      }

      await this.prisma.homework.delete({ where: { id } });
      return { message: `ID: ${id} vazifa o'chirildi` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Vazifani o'chirishda xato yuz berdi");
    }
  }
}
