import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PurchasedCourseService } from './purchased_course.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased_course.dto';
import { UpdatePurchasedCourseDto } from './dto/update-purchased_course.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('purchased-courses')
export class PurchasedCourseController {
  constructor(private readonly service: PurchasedCourseService) {}

  @Post()
  create(@Body() dto: CreatePurchasedCourseDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':userId/:courseId')
  findOne(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string
  ) {
    return this.service.findOne(userId, courseId)
  }

  @Patch(':userId/:courseId')
  update(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body() dto: UpdatePurchasedCourseDto
  ) {
    return this.service.update(userId, courseId, dto)
  }

  @Delete(':userId/:courseId')
  remove(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string
  ) {
    return this.service.remove(userId, courseId)
  }
}