import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased_course.dto';
import { UpdatePurchasedCourseDto } from './dto/update-purchased_course.dto';
@Injectable()
export class PurchasedCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePurchasedCourseDto) {
    return this.prisma.purchasedCourse.create({
      data: {
        userId: dto.userId,
        courseId: dto.courseId,
        amount: dto.amount,
        paidVia: dto.paidVia
      }
    })
  }

  async findAll() {
    return this.prisma.purchasedCourse.findMany({
      include: {
        user: true,
        course: true
      }
    })
  }

  async findOne(userId: string, courseId: string) {
    const purchased = await this.prisma.purchasedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        user: true,
        course: true
      }
    })
    if (!purchased) {
      throw new NotFoundException('Purchased course not found')
    }

    return purchased
  }

  async update(
    userId: string,
    courseId: string,
    dto: UpdatePurchasedCourseDto
  ) {
    await this.findOne(userId, courseId)

    return this.prisma.purchasedCourse.update({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      data: dto
    })
  }

  async remove(userId: string, courseId: string) {
    await this.findOne(userId, courseId)

    return this.prisma.purchasedCourse.delete({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })
  }
}