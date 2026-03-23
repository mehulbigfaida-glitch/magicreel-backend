import { Request, Response } from "express";
import streamifier from "streamifier";
import { cloudinary } from "../../utils/cloudinary";

export async function uploadModel(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    // Convert Buffer → Stream
    const bufferStream = streamifier.createReadStream(req.file.buffer);

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "magicreel/models",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferStream.pipe(stream);
    });

    const modelId = uploadResult.public_id;
    const modelImageUrl = uploadResult.secure_url;

    return res.json({
      success: true,
      data: {
        modelId,
        modelImageUrl,
      },
    });
  } catch (error) {
    console.error("❌ MODEL UPLOAD FAILED:", error);
    return res.status(500).json({
      success: false,
      error: "Model upload failed",
    });
  }
}
