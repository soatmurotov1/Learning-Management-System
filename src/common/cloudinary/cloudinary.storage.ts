import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'lessons/videos',
    resource_type: 'video',
    public_id: `${Date.now()}-${file.originalname}`
  })
})
