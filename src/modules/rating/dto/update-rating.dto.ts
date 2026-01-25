import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateRatingDto {
    @ApiProperty({ example: 1})
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rate?: number

  @ApiProperty({ example: "string"})
  @IsOptional()
  @IsString()
  comment?: string
}
