import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CloudinaryUploadService } from 'src/common/cloudinary/cloudinary.upload';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryUploadService,
  ) {}

  async create(dto: CreateLessonDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    try {
      const { url } = await this.cloudinaryService.uploadVideo(file);

      return this.prisma.lesson.create({
        data: {
          name: dto.name,
          about: dto.about,
          groupId: dto.bolimId,
          videoUrl: url
        },
        include: {
          files: true,
          homework: true
        }
      })
    } catch (error) {
      throw new BadRequestException(
        `Failed to create lesson: ${error.message}`
      )
    }
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: {
        files: true,
        homework: true
      }
    })
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        files: true,
        homework: true
      }
    })
    if (!lesson) throw new NotFoundException('Lesson topilmadi')
    return lesson
  }

  async update(id: string, dto: UpdateLessonDto, file?: Express.Multer.File) {
    const lesson = await this.findOne(id)

    try {
      const updateData: any = { ...dto, updatedAt: new Date() }

      if (file) {
        const { url } = await this.cloudinaryService.uploadVideo(file)
        updateData.videoUrl = url
      }

      return this.prisma.lesson.update({
        where: { id },
        data: updateData,
        include: {
          files: true,
          homework: true
        }
      })
    } catch (error) {
      throw new BadRequestException(
        `Failed to update lesson: ${error.message}`
      )
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lesson.delete({ where: { id }})
    return "Lesson o'chirildi"
  }
}
