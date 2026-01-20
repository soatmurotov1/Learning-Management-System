import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { VericationService } from './verication.service';
import { SendOtpDto } from './dto/send-otp.dto';

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
