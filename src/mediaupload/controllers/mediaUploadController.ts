import { Request, Response } from "express";
import { uploadToCloudinary } from "../../utils/cloudinary";

export async function handleMediaUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.path, {
      folder: "magicreel/media",
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      secure_url: result.secure_url,
      url: result.secure_url,
    });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
}
