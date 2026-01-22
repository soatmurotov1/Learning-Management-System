import { PartialType } from '@nestjs/swagger';
import { CreateAssignedCourseDto } from './create-assigned_course.dto';

export class UpdateAssignedCourseDto extends PartialType(CreateAssignedCourseDto) {}
