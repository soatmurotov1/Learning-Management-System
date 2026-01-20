import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { EVerificationTypes } from 'src/common/types/verification.types';

export class SendOtpDto {
  @ApiProperty({ example: '+998901112233' })
  @IsString()
  phone: string

  @ApiProperty({ example: 'register', enum: EVerificationTypes  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes
}
