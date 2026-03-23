import { Request, Response } from "express";
import streamifier from "streamifier";
import { cloudinary } from "../utils/cloudinary";

export async function uploadGarment(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No garment file uploaded",
      });
    }

    const bufferStream = streamifier.createReadStream(req.file.buffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "magicreel/garments",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferStream.pipe(stream);
    });

    return res.json({
      success: true,
      data: {
        garmentUrl: uploadResult.secure_url,
        garmentId: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.error("❌ Garment Upload Failed:", error);
    return res.status(500).json({
      success: false,
      error: "Garment upload failed",
    });
  }
}
