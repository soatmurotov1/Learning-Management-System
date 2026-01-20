import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VericationService } from './verication.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { CreateVericationDto } from './dto/create-verication.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { EVerificationTypes } from 'src/common/types/verification.types';

@ApiTags('Verification')
@Controller('verification')
export class VericationController {
  constructor(private readonly vericationService: VericationService) {}

  @IsPublic()
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.vericationService.sendOtp(dto.type, dto.phone);
  }
}
