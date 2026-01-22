import { Injectable } from '@nestjs/common';
import { CreateAssignedCourseDto } from './dto/create-assigned_course.dto';
import { UpdateAssignedCourseDto } from './dto/update-assigned_course.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignedCourseService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAssignedCourseDto: CreateAssignedCourseDto) {
    const { userId, courseId } = createAssignedCourseDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      throw new Error('User not found');
    }
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new Error('Course not found')
    }

    const existingAssignment = await this.prisma.assignedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    if (existingAssignment) {
      throw new Error('Course already assigned to this user');
    }

    return await this.prisma.assignedCourse.create({
      data: {
        userId,
        courseId,
      },
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.assignedCourse.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findOne(userId: string, courseId: string) {
    const assignedCourse = await this.prisma.assignedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        user: true,
        course: true,
      }
    })
    if (!assignedCourse) {
      throw new Error('Assigned course not found');
    }
    return assignedCourse
  }

  async update(
    userId: string,
    courseId: string,
    updateAssignedCourseDto: UpdateAssignedCourseDto
  ) {
    const { userId: newUserId, courseId: newCourseId } =
      updateAssignedCourseDto

    await this.prisma.assignedCourse.delete({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })
    return await this.create({
      userId: newUserId || userId,
      courseId: newCourseId || courseId
    })
  }

  async remove(userId: string, courseId: string) {
    return await this.prisma.assignedCourse.delete({
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
  }
}
