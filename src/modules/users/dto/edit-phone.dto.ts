import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditPhoneDto {
  @ApiProperty({ example: "+998901112233"})
  @IsString()
  newPhone: string

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string
}
