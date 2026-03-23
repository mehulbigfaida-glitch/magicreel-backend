console.log("🔥 REEL CONTROLLER HIT");
import { Request, Response } from "express";
import { generateReelV1 } from "../../../magicreel/services/reelV1.service";

export async function generateReelV1Controller(
  req: Request,
  res: Response
) {
  try {
    const { jobId, heroPreviewUrl } = req.body;

    if (!jobId || !heroPreviewUrl) {
      return res.status(400).json({
        success: false,
        error: "jobId and heroPreviewUrl are required",
      });
    }

    const result = await generateReelV1({
      jobId,
      heroPreviewUrl,
    });

    return res.status(200).json({
      success: true,
      reelVideoUrl: result.reelVideoUrl,
    });
  } catch (error: any) {
    console.error("Reel V1 Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Reel generation failed",
    });
  }
}