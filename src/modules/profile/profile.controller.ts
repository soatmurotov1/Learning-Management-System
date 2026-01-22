import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Auth } from '../../common/decorator/auth.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Auth()
  @Get()
  getProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @Auth()
  @Patch()
  update(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Auth()
  @Delete()
  remove(@Req() req: any) {
    const userId = req.user.id;
    return this.profileService.deleteProfile(userId)
  }
}
