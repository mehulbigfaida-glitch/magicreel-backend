import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface CloudinaryUploadOptions {
  folder: string;
  public_id?: string;
  overwrite?: boolean;
}

export async function uploadToCloudinary(
  localFilePath: string,
  options: CloudinaryUploadOptions
): Promise<{ secure_url: string }> {
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder: options.folder,
    public_id: options.public_id,
    overwrite: options.overwrite ?? true,
  });

  if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }

  return {
    secure_url: result.secure_url,
  };
}

export { cloudinary };