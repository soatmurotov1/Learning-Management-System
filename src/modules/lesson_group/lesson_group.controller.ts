import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonGroupService } from './lesson_group.service';
import { CreateLessonGroupDto } from './dto/create-lesson_group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson_group.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("LessonGroup")
@Controller('lesson_group')
export class LessonGroupController {
  constructor(private readonly lessonGroupService: LessonGroupService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "ADMIN"})
  create(@Body() createLessonGroupDto: CreateLessonGroupDto) {
    return this.lessonGroupService.create(createLessonGroupDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: "ADMIN, MENTOR, ASSISTANT, STUDENT"})
  findAll() {
    return this.lessonGroupService.findAll()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: "ADMIN, MENTOR, ASSISTANT, STUDENT"})
  findOne(@Param('id') id: string) {
    return this.lessonGroupService.findOne(+id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "ADMIN"})
  update(@Param('id') id: string, @Body() updateLessonGroupDto: UpdateLessonGroupDto) {
    return this.lessonGroupService.update(+id, updateLessonGroupDto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "ADMIN"})
  async remove(@Param('id') id: string) {
    await this.lessonGroupService.remove(+id)
    return `LessonGroup ${id} o'chirildi`
  }
}
