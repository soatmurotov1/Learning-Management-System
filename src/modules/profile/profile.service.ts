import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        mentorProfile: true,
        assigned: {
          include: {
            course: {
              include: {
                category: true,
              }
            }
          }
        },
        purchased: {
          include: {
            course: {
              include: {
                category: true,
              },
            },
          },
        },
        ratings: true,
        lessonViews: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const courses = [
      ...user.assigned.map((ac) => ({
        ...ac.course,
        assignedAt: ac.createdAt,
      })),
      ...user.purchased.map((pc) => ({
        ...pc.course,
        purchasedAt: pc.purchasedAt,
      })),
    ];

    return {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      image: user.image,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      mentorProfile: user.mentorProfile,
      courses: courses,
      ratings: user.ratings,
      lessonViews: user.lessonViews,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: updateProfileDto.fullName || user.fullName,
        image: updateProfileDto.image || user.image,
      },
      include: {
        mentorProfile: true,
        assigned: {
          include: {
            course: {
              include: {
                category: true,
              },
            },
          },
        },
        purchased: {
          include: {
            course: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const courses = [
      ...updatedUser.assigned.map((ac) => ({
        ...ac.course,
        assignedAt: ac.createdAt,
      })),
      ...updatedUser.purchased.map((pc) => ({
        ...pc.course,
        purchasedAt: pc.purchasedAt,
      })),
    ];

    return {
      id: updatedUser.id,
      phone: updatedUser.phone,
      fullName: updatedUser.fullName,
      image: updatedUser.image,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      courses: courses,
    };
  }

  async deleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: "Profil o'chirildi",
      userId: userId,
    };
  }
}
