import { Module } from '@nestjs/common';
import { CloudinaryUploadService } from './cloudinary.upload';

@Module({
  providers: [CloudinaryUploadService],
  exports: [CloudinaryUploadService],
})
export class CloudinaryModule {}
