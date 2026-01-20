import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPassword } from './dto/reset-password.dto';
import { RefreshToken } from './dto/refresh_token.dto';
import { EditPhoneDto } from './dto/edit-phone.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto)
  }

  @IsPublic()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.usersService.login(dto)
  }

  @IsPublic()
  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshToken) {
    return this.usersService.refreshToken(dto)
  }

  @IsPublic()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPassword) {
    return this.usersService.resetPassword(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit-phone')
  @ApiBearerAuth()
  async editPhone(@Request() req: any, @Body() dto: EditPhoneDto) {
    return this.usersService.editPhone(req.user.sub, dto.newPhone, dto.otp)
  }
}
