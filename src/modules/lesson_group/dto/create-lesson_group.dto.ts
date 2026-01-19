import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLessonGroupDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  courseId: string
}
