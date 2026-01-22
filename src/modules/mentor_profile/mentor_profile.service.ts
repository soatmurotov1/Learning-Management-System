import { Injectable, ForbiddenException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMentorProfileDto } from './dto/create-mentor_profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor_profile.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class MentorProfileService {
  constructor(private prisma: PrismaService) {}
  private async checkAccess(
    userId: string,
    targetUserId: string,
    userRole: UserRole,
  ) {
    if (userRole === UserRole.ADMIN) {
      return true;
    }
    if (userId !== targetUserId) {
      throw new ForbiddenException(
        "Siz faqat o'z profilingizni o'zgartirishingiz mumkin",
      );
    }
    return true;
  }

  async create(
    dto: CreateMentorProfileDto,
    userRole: UserRole,
    currentUserId: string,
  ) {
    if (userRole !== UserRole.ADMIN && dto.userId !== currentUserId) {
      throw new ForbiddenException(
        "Siz faqat o'z profil uchun mentor profilini yarata olasiz",
      );
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const existingProfile = await this.prisma.mentorProfile.findUnique({
      where: { userId: dto.userId },
    });

    if (existingProfile) {
      throw new HttpException(
        'Bu foydalanuvchi uchun mentor profili allaqachon mavjud',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prisma.mentorProfile.create({
      data: {
        userId: dto.userId,
        about: dto.about,
        job: dto.job,
        experience: dto.experience || 0,
        telegram: dto.telegram,
        instagram: dto.instagram,
        linkedin: dto.linkedin,
        facebook: dto.facebook,
        github: dto.github,
        website: dto.website,
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(userRole: UserRole, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const profiles = await this.prisma.mentorProfile.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
    const total = await this.prisma.mentorProfile.count();
    return {
      data: profiles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            role: true,
            image: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });
    if (!profile) {
      throw new NotFoundException('Mentor profili topilmadi');
    }

    return profile;
  }

  async update(
    id: string,
    dto: UpdateMentorProfileDto,
    userRole: UserRole,
    currentUserId: string,
  ) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Mentor profili topilmadi');
    }

    await this.checkAccess(currentUserId, profile.userId, userRole);
    return this.prisma.mentorProfile.update({
      where: { id },
      data: {
        about: dto.about,
        job: dto.job,
        experience: dto.experience,
        telegram: dto.telegram,
        instagram: dto.instagram,
        linkedin: dto.linkedin,
        facebook: dto.facebook,
        github: dto.github,
        website: dto.website,
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string, userRole: UserRole, currentUserId: string) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Mentor profili topilmadi');
    }
    await this.checkAccess(currentUserId, profile.userId, userRole);
    await this.prisma.mentorProfile.delete({
      where: { id },
    });
    return "Mentor profile o'chirildi";
  }

  async getMyProfile(userId: string) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            role: true,
            image: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });
    if (!profile) {
      throw new NotFoundException('Sizning mentor profilingiz topilmadi');
    }
    return profile;
  }
}
