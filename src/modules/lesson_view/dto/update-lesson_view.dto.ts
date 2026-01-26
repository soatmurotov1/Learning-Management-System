import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateLessonViewDto } from './create-lesson_view.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLessonViewDto extends PartialType(CreateLessonViewDto) {
      @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  view?: boolean
  
}
