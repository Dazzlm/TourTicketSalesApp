import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const ImageService = {
  async saveImage(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen válida (JPEG, PNG, etc.)');
    }

    const maxSizeMB = 25;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`La imagen no puede superar los ${maxSizeMB} MB`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tours',
          public_id: randomUUID(),
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },
};
