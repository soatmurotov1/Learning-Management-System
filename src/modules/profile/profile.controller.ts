import { Controller, Get, Body, Patch, Delete, Req, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Auth()
  getProfile(@Req() req: any) {
    const userId = req.user.id
    return this.profileService.getProfile(userId)
  }

  @Auth()
  @Patch()
  update(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateProfileDto)
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':userId')
  @ApiOperation({ summary: "ADMIN" })
  updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.profileService.updateProfile(userId, updateProfileDto)
  }
  @Auth()
  @Delete()
  remove(@Req() req: any) {
    const userId = req.user.id;
    return this.profileService.deleteProfile(userId)
  }
}
