import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export async function uploadToCloudinary(
  filePath: string,
  options: {
    folder?: string;
    public_id?: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
  } = {}
) {
  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: options.folder || '',
        public_id: options.public_id || path.parse(filePath).name,
        resource_type: options.resource_type || 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

// ✅ Export cloudinary properly
export { cloudinary };
