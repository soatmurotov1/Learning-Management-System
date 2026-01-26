import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { PaidVia } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePurchasedCourseDto {
  @ApiProperty({ example: "string" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "string" })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 120000, required: false })
  @IsOptional()
  @Type(() => Number)   
  @IsNumber()
  amount?: number

  @ApiProperty({ enum: PaidVia, example: PaidVia.CASH, default: PaidVia.CASH })
  @IsEnum(PaidVia)
  paidVia: PaidVia
}
