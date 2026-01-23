import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  about: string
  

  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  bolimId: string

}
