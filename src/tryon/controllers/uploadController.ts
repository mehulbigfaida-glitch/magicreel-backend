import { Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // STEP 1 — Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "magicreel/models",
      resource_type: "image",
    });

    // STEP 2 — Generate model ID
    const modelId = uuidv4();

    // STEP 3 — Return shape expected by frontend
    return res.json({
      success: true,
      data: {
        modelId,
        modelImageUrl: result.secure_url,
      },
    });

  } catch (error: any) {
    console.error("❌ Upload Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};
