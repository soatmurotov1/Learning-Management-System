import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CloudinaryUploadService } from 'src/common/cloudinary/cloudinary.upload';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryUploadService,
  ) {}
  async create(
    dto: CreateCourseDto,
    files: {
      banner?: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
    userId: string,
  ) {
    if (!dto.mentorId) {
      throw new BadRequestException("To'g'ri mentor ID ni kiriting");
    }
    const mentor = await this.prisma.user.findUnique({
      where: { id: dto.mentorId },
    });

    if (!mentor) {
      throw new NotFoundException(
        `ID: ${dto.mentorId} bo'lgan mentor topilmadi. Iltimos, mavjud mentor ID ni kiriting`,
      );
    }
    if (!dto.categoryId) {
      throw new BadRequestException("To'g'ri kategoriya ID ni kiriting");
    }
    const category = await this.prisma.courseCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `ID: ${dto.categoryId} bo'lgan kategoriya topilmadi`,
      );
    }

    let bannerUrl: any = null;
    if (files?.banner?.[0]) {
      const uploadedBanner = await this.cloudinaryService.uploadFile(
        files.banner[0],
      );
      bannerUrl = uploadedBanner.url;
    }

    let introVideoUrl: any = null;
    if (files?.introVideo?.[0]) {
      const uploadedIntroVideo = await this.cloudinaryService.uploadFile(
        files.introVideo[0],
      );
      introVideoUrl = uploadedIntroVideo.url;
    }

    return this.prisma.course.create({
      data: {
        name: dto.name,
        about: dto.about,
        price: dto.price,
        banner: bannerUrl,
        introVideo: introVideoUrl,
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

  async update(
    id: string,
    dto: UpdateCourseDto,
    userId: string,
    files?: {
      banner?: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
  ) {
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

    let bannerUrl: any = course.banner;
    if (files?.banner?.[0]) {
      const uploadedBanner = await this.cloudinaryService.uploadFile(
        files.banner[0],
      );
      bannerUrl = uploadedBanner.url;
    }

    let introVideoUrl: any = course.introVideo;
    if (files?.introVideo?.[0]) {
      const uploadedIntroVideo = await this.cloudinaryService.uploadFile(
        files.introVideo[0],
      );
      introVideoUrl = uploadedIntroVideo.url;
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        name: dto.name,
        about: dto.about,
        price: dto.price,
        banner: bannerUrl,
        introVideo: introVideoUrl,
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

  async remove(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    await this.prisma.course.delete({ where: { id } });
    return `Kurs o'chirildi`;
  }
}
