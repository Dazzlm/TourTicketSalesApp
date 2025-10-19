import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    const ext = path.extname(file.name);
    const uniqueName = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);

    return `/uploads/${uniqueName}`;
  },
};
