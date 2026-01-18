import { Module } from '@nestjs/common';
import { MentorProfileService } from './mentor_profile.service';
import { MentorProfileController } from './mentor_profile.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MentorProfileController],
  providers: [MentorProfileService, PrismaService, ConfigService],
  exports: [MentorProfileService]
})
export class MentorProfileModule {}
