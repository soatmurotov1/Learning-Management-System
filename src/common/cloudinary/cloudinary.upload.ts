import { BadRequestException, Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';

@Injectable()
export class CloudinaryUploadService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; publicId: string }> {
    try {
      if (!file) {
        throw new BadRequestException('File not provided');
      }

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
          },
          (error, result: any) => {
            if (error) {
              reject(
                new BadRequestException(`Upload failed: ${error.message}`),
              );
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            } else {
              reject(
                new BadRequestException('Upload failed: No result returned'),
              );
            }
          },
        );

        stream.end(file.buffer);
      });
    } catch (error) {
      throw new BadRequestException(`File upload error: ${error.message}`);
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
  ): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('Video file not provided');
    }

    if (!file.mimetype.startsWith('video/')) {
      throw new BadRequestException('Only video files are allowed');
    }

    return this.uploadFile(file, 'lessons/videos');
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } catch (error) {
      throw new BadRequestException(`Video delete failed: ${error.message}`);
    }
  }
}
