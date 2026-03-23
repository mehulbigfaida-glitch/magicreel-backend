import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadVideoToCloudinary(
  videoPath: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(videoPath, {
    resource_type: "video",
    folder: "magicreel/videos",
    use_filename: true,
    unique_filename: true,
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return result.secure_url;
}
