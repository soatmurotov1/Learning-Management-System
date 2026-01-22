import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course_category.dto';

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const existingCategory = await this.prisma.courseCategory.findFirst({
      where: {
        name: {
          equals: createCourseCategoryDto.name,
          mode: 'insensitive',
        }
      }
    })

    if (existingCategory) {
      throw new HttpException(
        'Bu kategoriya allaqachon mavjud',
        HttpStatus.BAD_REQUEST
      )
    }

    return this.prisma.courseCategory.create({
      data: {
        name: createCourseCategoryDto.name
      }
    })
  }

  async findAll() {
    return this.prisma.courseCategory.findMany({
      include: {
        courses: {
          where: { published: true },
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  }

  async findOne(id: string) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id },
      include: {
        courses: {
          where: { published: true },
          select: {
            id: true,
            name: true,
            price: true,
            banner: true,
            level: true
          }
        }
      }
    })

    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }
    return category
  }

  async update(id: string, updateCourseCategoryDto: UpdateCourseCategoryDto) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi')
    }
    if (updateCourseCategoryDto.name) {
      const existingCategory = await this.prisma.courseCategory.findFirst({
        where: {
          name: {
            equals: updateCourseCategoryDto.name,
            mode: 'insensitive'
          },
          NOT: {
            id: id
          }
        }
      })

      if (existingCategory) {
        throw new HttpException(
          'Bu kategoriya allaqachon mavjud',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    return this.prisma.courseCategory.update({
      where: { id },
      data: updateCourseCategoryDto,
      include: {
        courses: {
          where: { published: true },
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }

  async remove(id: string) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id }
    })

    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi')
    }

    await this.prisma.courseCategory.delete({ where: { id } })
    return `Kategoriya o;chirildi`
  }
}
