import { Controller, Post, Get, Patch, Delete, Param, Body, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('lesson')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string'},
        about: { type: 'string'},
        bolimId: { type: 'string', format: 'uuid' },
        video: { type: 'string', format: 'binary', description: 'Video file (mp4, webm, avi, mov)'},
      },
      required: ['name', 'about', 'bolimId', 'video']
    }
  })
  create(
    @Body() dto: CreateLessonDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.lessonService.create(dto, file)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT'})
  findAll() { return this.lessonService.findAll()}

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        about: { type: 'string' },
        bolimId: { type: 'string', format: 'uuid' },
        video: { type: 'string', format: 'binary', description: 'Video file (optional)'
        }
      }
    }
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.lessonService.update(id, dto, file)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  async remove(@Param('id') id: string) {
    await this.lessonService.remove(id)
    return "Lesson o'chirildi"
  }
}
