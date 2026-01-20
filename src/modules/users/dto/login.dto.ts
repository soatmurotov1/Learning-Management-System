import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '+998901112233' })
  @IsString()
  phone: string

  @ApiProperty({ example: '000000' })
  @IsString()
  password: string
}
