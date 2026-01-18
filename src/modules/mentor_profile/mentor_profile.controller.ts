import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MentorProfileService } from './mentor_profile.service';
import { CreateMentorProfileDto } from './dto/create-mentor_profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor_profile.dto';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@ApiBearerAuth()
@Controller('mentor_profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Create mentor profile' })
  async create(
    @Body() createMentorProfileDto: CreateMentorProfileDto,
    @Request() req: any,
  ) {
    return this.mentorProfileService.create(
      createMentorProfileDto,
      req.user.role,
      req.user.id,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any,
  ) {
    return this.mentorProfileService.findAll(
      req.user.role,
      parseInt(page),
      parseInt(limit)
    )
  }

  @Get('user/:userId')
  @IsPublic()
  async findByUserId(@Param('userId') userId: string) {
    return this.mentorProfileService.findByUserId(parseInt(userId))
  }

  @Get(':id')
  @IsPublic()
  async findOne(@Param('id') id: string) {
    return this.mentorProfileService.findOne(parseInt(id))
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async update(
    @Param('id') id: string,
    @Body() updateMentorProfileDto: UpdateMentorProfileDto,
    @Request() req: any
  ) {
    return this.mentorProfileService.update(
      parseInt(id),
      updateMentorProfileDto,
      req.user.role,
      req.user.id
    )
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.mentorProfileService.remove(
      parseInt(id),
      req.user.role,
      req.user.id
    )
  }
}
