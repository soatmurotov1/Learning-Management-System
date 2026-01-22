import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssignedCourseService } from './assigned_course.service';
import { CreateAssignedCourseDto } from './dto/create-assigned_course.dto';
import { UpdateAssignedCourseDto } from './dto/update-assigned_course.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assigned_course')
export class AssignedCourseController {
  constructor(private readonly assignedCourseService: AssignedCourseService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ADMIN' })
  create(@Body() createAssignedCourseDto: CreateAssignedCourseDto) {
    return this.assignedCourseService.create(createAssignedCourseDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findAll() {
    return this.assignedCourseService.findAll();
  }

  @Get(':userId/:courseId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findOne(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.assignedCourseService.findOne(userId, courseId);
  }

  @Patch(':userId/:courseId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ADMIN' })
  update(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body() updateAssignedCourseDto: UpdateAssignedCourseDto,
  ) {
    return this.assignedCourseService.update(
      userId,
      courseId,
      updateAssignedCourseDto,
    );
  }

  @Delete(':userId/:courseId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ADMIN' })
  remove(@Param('userId') userId: string, @Param('courseId') courseId: string) {
    return this.assignedCourseService.remove(userId, courseId);
  }
}
