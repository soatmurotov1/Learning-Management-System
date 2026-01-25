import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  task: string

  @ApiProperty({ example: 'string' })
  @IsString()
  lessonId: string
}
