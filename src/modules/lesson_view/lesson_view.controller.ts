import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LessonViewService } from './lesson_view.service';
import { CreateLessonViewDto } from './dto/create-lesson_view.dto';
import { UpdateLessonViewDto } from './dto/update-lesson_view.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('LessonView')
@Controller('lesson_views')
export class LessonViewController {
  constructor(private readonly service: LessonViewService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  create(@Body() dto: CreateLessonViewDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':lessonId/:userId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findOne(
    @Param('lessonId') lessonId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.findOne(lessonId, userId);
  }

  @Patch(':lessonId/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ADMIN' })
  update(
    @Param('lessonId') lessonId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateLessonViewDto,
  ) {
    return this.service.update(lessonId, userId, dto);
  }

  @Delete(':lessonId/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ADMIN' })
  remove(@Param('lessonId') lessonId: string, @Param('userId') userId: string) {
    return this.service.remove(lessonId, userId);
  }
}
