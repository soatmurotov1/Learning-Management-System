import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { sendOtpDto } from './dto/create-verification.dto';

@Controller("verification")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post("send")
  sendOtp(@Body() body: sendOtpDto) {
    return this.verificationService.sendOtp(body);
  }
}
