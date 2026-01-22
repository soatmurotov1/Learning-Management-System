import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditPhoneDto {
  @ApiProperty({ example: "+998901112233"})
  @IsString()
  oldPhone: string

  @ApiProperty({ example: "+998901112233"})
  @IsString()
  newPhone: string

  @ApiProperty({ example: '000000' })
  @IsString()
  otp: string
}
