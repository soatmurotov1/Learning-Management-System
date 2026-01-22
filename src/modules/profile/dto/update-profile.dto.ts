import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: "string" })
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiProperty({ example: "https://example.com"})
  @IsOptional()
  @IsString()
  image?: string

  @ApiProperty({ example: "string"})
  @IsOptional()
  @IsString()
  password?: string

}
