import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('banner'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        about: { type: 'string' },
        price: { type: 'number' },
        banner: { type: 'string', format: 'binary' },
        introVideo: { type: 'string' },
        level: { type: 'string' },
        published: { type: 'boolean' },
        categoryId: { type: 'string' },
        mentorId: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'ADMIN' })
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() bannerFile: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.courseService.create(createCourseDto, bannerFile, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.courseService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('banner'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        about: { type: 'string' },
        price: { type: 'number' },
        banner: { type: 'string', format: 'binary' },
        introVideo: { type: 'string' },
        level: { type: 'string' },
        published: { type: 'boolean' },
        categoryId: { type: 'string' },
        mentorId: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'ADMIN' })
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() bannerFile: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.courseService.update(
      id,
      updateCourseDto,
      req.user.id,
      bannerFile,
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'ADMIN' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.courseService.remove(id, req.user.id);
  }
}
