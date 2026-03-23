import { Request, Response } from "express";
import { TryOnService } from "../services/TryOnService";

const tryOnService = new TryOnService();

export const generateTryOn = async (req: Request, res: Response) => {
  try {
    const { modelImageUrl, garmentImageUrl } = req.body;

    if (!modelImageUrl || !garmentImageUrl) {
      return res.status(400).json({
        success: false,
        error: "modelImageUrl and garmentImageUrl are required"
      });
    }

    const result = await tryOnService.generateTryOn({
      modelImageUrl,
      garmentImageUrl
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Try-on Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Try-on generation failed"
    });
  }
};
