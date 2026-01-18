import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMentorProfileDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  about?: string

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  job?: string

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  experience?: number

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  telegram?: string

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  instagram?: string

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  linkedin?: string

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  facebook?: string

  @ApiProperty({ example: 'string'})
  @IsString()
  @IsOptional()
  github?: string

  @ApiProperty({ example: "string" })
  @IsString()
  @IsOptional()
  website?: string
  
}
