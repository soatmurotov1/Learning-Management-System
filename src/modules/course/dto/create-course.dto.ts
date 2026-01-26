import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  about: string;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  banner: any;

  @ApiProperty({ example: 'string' })
  @IsOptional()
  @IsString()
  introVideo?: string;

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ example: 'string' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  mentorId: string;
}
