import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Homework')
@ApiBearerAuth()
@Controller('homework')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi vazifa yaratish (token talab qiladi)' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHomeworkDto: CreateHomeworkDto, @Request() req: any) {
    return this.homeworkService.create(createHomeworkDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Barcha vazifalarni olish (token talab qiladi)' })
  findAll() {
    return this.homeworkService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: "Vazifani ID bo'yicha olish (token talab qiladi)" })
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Vazifani tahrirlash (token talab qiladi)' })
  update(
    @Param('id') id: string,
    @Body() updateHomeworkDto: UpdateHomeworkDto,
    @Request() req: any
  ) {
    return this.homeworkService.update(+id, updateHomeworkDto, req.user.id)
  }

  @Delete(':id')
  @ApiOperation({ summary: "Vazifani o'chirish (token talab qiladi)" })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.homeworkService.remove(+id, req.user.id)
  }
}

