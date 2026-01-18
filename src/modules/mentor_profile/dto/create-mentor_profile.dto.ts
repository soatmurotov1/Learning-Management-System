import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMentorProfileDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'Professional Python developer with 10+ years experience',
    description: 'About mentor',
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({
    example: 'Senior Software Engineer',
    description: 'Job title',
  })
  @IsString()
  @IsOptional()
  job?: string;

  @ApiProperty({
    example: 10,
    description: 'Years of experience',
  })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({
    example: '@mentor_username',
    description: 'Telegram username',
  })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    example: '@mentor_instagram',
    description: 'Instagram username',
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    example: 'https://linkedin.com/in/mentor',
    description: 'LinkedIn profile URL',
  })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    example: '@mentor_facebook',
    description: 'Facebook profile',
  })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    example: 'https://github.com/mentor',
    description: 'GitHub profile URL',
  })
  @IsString()
  @IsOptional()
  github?: string;

  @ApiProperty({
    example: 'https://myportfolio.com',
    description: 'Personal website URL',
  })
  @IsString()
  @IsOptional()
  website?: string;
}
