import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MentorProfileService } from './mentor_profile.service';
import { CreateMentorProfileDto } from './dto/create-mentor_profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor_profile.dto';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller('mentor_profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  async create(
    @Body() createMentorProfileDto: CreateMentorProfileDto,
    @Request() req: any,
  ) {
    return this.mentorProfileService.create(
      createMentorProfileDto,
      req.user.role,
      req.user.id
    )
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: "ADMIN, MENTOR" })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any
  ) {
    return this.mentorProfileService.findAll(
      req.user?.role,
      parseInt(page),
      parseInt(limit)
    )
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  async findOne(@Param('id') id: string) {
    return this.mentorProfileService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async update(
    @Param('id') id: string,
    @Body() updateMentorProfileDto: UpdateMentorProfileDto,
    @Request() req: any,
  ) {
    return this.mentorProfileService.update(
      id,
      updateMentorProfileDto,
      req.user.role,
      req.user.id
    )
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.mentorProfileService.remove(id, req.user.role, req.user.id)
    return "Mentor profile o'chrildi"
  }
}
