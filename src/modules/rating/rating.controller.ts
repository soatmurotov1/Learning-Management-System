import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @Post()
  create(@Req() req, @Body() dto: CreateRatingDto) {
    return this.ratingService.create(req.user.id, dto)
  }

  @Get('course/:courseId')
  findAllByCourse(@Param('courseId') courseId: string) {
    return this.ratingService.findAllByCourse(courseId)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateRatingDto) {
    return this.ratingService.update(id, req.user.id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.ratingService.remove(id, req.user.id)
  }
}
