import { IsString, IsBoolean, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  name: string

  @ApiProperty({ example: 'string' })
  @IsString()
  about: string

  @ApiProperty({ example: 10 })
  @IsNumber()
  price: number

  @ApiProperty({ example: 'string' })
  @IsString()
  banner: string

  @ApiProperty({ example: 'string' })
  @IsOptional()
  @IsString()
  introVideo?: string

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean

  @ApiProperty({ example: 'string' })
  @IsString()
  categoryId: string

  @ApiProperty({ example: 'string' })
  @IsString()
  mentorId: string
}
