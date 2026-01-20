import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateCourseDto, userId: number) {
    // Validate mentorId is provided
    if (!dto.mentorId || dto.mentorId <= 0) {
      throw new BadRequestException(
        "Mentor ID noto'g'ri. Iltimos, to'g'ri mentor ID ni kiriting",
      );
    }

    // Check if mentor exists
    const mentor = await this.prisma.user.findUnique({
      where: { id: dto.mentorId },
    });

    if (!mentor) {
      throw new NotFoundException(
        `ID: ${dto.mentorId} bo'lgan mentor topilmadi. Iltimos, mavjud mentor ID ni kiriting`,
      );
    }

    // Validate categoryId is provided
    if (!dto.categoryId || dto.categoryId <= 0) {
      throw new BadRequestException(
        "Kategoriya ID noto'g'ri. Iltimos, to'g'ri kategoriya ID ni kiriting",
      );
    }

    // Check if category exists
    const category = await this.prisma.courseCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `ID: ${dto.categoryId} bo'lgan kategoriya topilmadi. Iltimos, mavjud kategoriya ID ni kiriting`,
      );
    }

    return this.prisma.course.create({
      data: {
        name: dto.name,
        about: dto.about,
        price: dto.price,
        banner: dto.banner,
        introVideo: dto.introVideo,
        level: dto.level,
        published: dto.published || false,
        categoryId: dto.categoryId,
        mentorId: dto.mentorId,
      },
      include: {
        category: true,
        mentor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: { published: true },
        skip,
        take: limit,
        include: {
          category: true,
          mentor: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where: { published: true } }),
    ]);
    return {
      data: courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        mentor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            image: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, userId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    if (dto.mentorId && dto.mentorId !== course.mentorId) {
      const mentor = await this.prisma.user.findUnique({
        where: { id: dto.mentorId },
      });

      if (!mentor) {
        throw new NotFoundException('Mentor topilmadi');
      }
    }
    if (dto.categoryId && dto.categoryId !== course.categoryId) {
      const category = await this.prisma.courseCategory.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        name: dto.name,
        about: dto.about,
        price: dto.price,
        banner: dto.banner,
        introVideo: dto.introVideo,
        level: dto.level,
        published: dto.published,
        categoryId: dto.categoryId,
        mentorId: dto.mentorId,
      },
      include: {
        category: true,
        mentor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
