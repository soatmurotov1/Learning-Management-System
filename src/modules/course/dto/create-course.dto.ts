import { IsString, IsDecimal, IsInt, IsBoolean, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';

export class CreateCourseDto {

  @ApiProperty({ example: "string"})
  @IsString()
  name: string

  @ApiProperty({ example: "string"})
  @IsString()
  about: string

  @ApiProperty({ example: 10})
  @IsNumber()  
  price: number

  @ApiProperty({ example: "string"})
  @IsString()
  banner: string

  @ApiProperty({ example: "string"})
  @IsOptional()
  @IsString()
  introVideo?: string

  @ApiProperty({ enum: CourseLevel})
  @IsEnum(CourseLevel)
  level: CourseLevel

  @ApiProperty({ example: true})
  @IsOptional()
  @IsBoolean()
  published?: boolean

  @ApiProperty({ example: 1})
  @IsInt()
  categoryId: number

  @ApiProperty({ example: 1})
  @IsInt()
  mentorId: number
}
