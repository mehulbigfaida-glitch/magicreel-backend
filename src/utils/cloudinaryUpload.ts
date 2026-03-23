// src/tryon/utils/cloudinaryUpload.ts

import { v2 as cloudinary } from "cloudinary";

/**
 * Uploads a buffer to Cloudinary and returns the secure URL
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image"
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            return reject(
              new Error(
                error?.message || "Cloudinary upload failed"
              )
            );
          }

          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}
