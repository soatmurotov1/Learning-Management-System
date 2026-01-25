import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: 1})
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number

  @ApiProperty({ example: "string"})
  @IsString()
  @IsNotEmpty()
  comment: string

  @ApiProperty({ example: "string"})
  @IsString()
  courseId: string
}
