import { PartialType } from '@nestjs/swagger';
import { CreateLessonGroupDto } from './create-lesson_group.dto';

export class UpdateLessonGroupDto extends PartialType(CreateLessonGroupDto) {}
