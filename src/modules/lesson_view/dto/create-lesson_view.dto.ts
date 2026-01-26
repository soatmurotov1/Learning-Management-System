import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class CreateLessonViewDto {
  @ApiProperty({ example: "string" })
  @IsUUID()
  lessonId: string

  @ApiProperty({ example: "string"})
  @IsUUID()
  userId: string

  @ApiProperty({ example: true, type: "boolean"})
  @IsBoolean()
  view: boolean

}
