import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  @IsPublic()
  @Post('verify')
  async verify(@Body() dto: VerifyDto) {
    return this.usersService.verify(dto);
  }

  @IsPublic()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  @ApiBearerAuth()
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(parseInt(id));
  }
}
