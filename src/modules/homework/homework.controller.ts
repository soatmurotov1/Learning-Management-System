import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus, UseInterceptors, UploadedFile} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Homework')
@ApiBearerAuth()
@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        task: { type: 'string' },
        file: { type: 'string', format: 'binary' },
        lessonId: { type: 'string' }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createHomeworkDto: CreateHomeworkDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    return this.homeworkService.create(createHomeworkDto, file, req.user.id)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findAll() {
    return this.homeworkService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR, UserRole.STUDENT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT, STUDENT' })
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        task: { type: 'string' },
        file: { type: 'string', format: 'binary' },
        lessonId: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  update(
    @Param('id') id: string,
    @Body() updateHomeworkDto: UpdateHomeworkDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    return this.homeworkService.update(
      id,
      updateHomeworkDto,
      req.user.id,
      file
    )
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'ADMIN, MENTOR, ASSISTANT' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.homeworkService.remove(id, req.user.id);
  }
}
