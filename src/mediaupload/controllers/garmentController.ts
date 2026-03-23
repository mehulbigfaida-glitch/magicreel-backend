import { Request, Response } from "express";
import cloudinary from "../../config/cloudinary";

export const fetchGarments = async (req: Request, res: Response) => {
  try {
    const folder = "magicreel/garments";

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .max_results(500)
      .execute();

    const garments = result.resources.map((item: any) => ({
      url: item.secure_url,
      public_id: item.public_id,
      filename: item.public_id.split("/").pop(),
    }));

    return res.json({ success: true, data: garments });
  } catch (err: any) {
    console.error("❌ Garment Fetch Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch garments",
      error: err.message
    });
  }
};
