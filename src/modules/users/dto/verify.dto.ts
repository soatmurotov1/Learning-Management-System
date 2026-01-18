import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ example: '+998901112233' })
  @IsString()
  phone: string

  @ApiProperty({ example: '000000' })
  @IsString()
  @Length(6, 6)
  otp: string
}
