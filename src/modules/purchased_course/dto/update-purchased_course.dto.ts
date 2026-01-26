import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class UpdatePurchasedCourseDto {
  @IsOptional()
  @IsNumber()
  amount?: number

  @IsOptional()
  @IsEnum(PaidVia)
  paidVia?: PaidVia
}
