import { Request, Response } from "express";
import path from "path";
import { poseGenerationService } from "./poseGeneration.service";

export const generatePoses = async (req: Request, res: Response) => {
  try {
    const { heroImagePath } = req.body;

    if (!heroImagePath) {
      return res.status(400).json({
        success: false,
        error: "heroImagePath is required"
      });
    }

    const outputDir = path.join(
      process.cwd(),
      "src",
      "poses",
      "outputs",
      Date.now().toString()
    );

    const generatedImages = await poseGenerationService.generatePoses({
      heroImagePath,
      outputDir
    });

    return res.status(200).json({
      success: true,
      images: generatedImages
    });

  } catch (error: any) {
    console.error("Pose generation failed:", error.message || error);
    return res.status(500).json({
      success: false,
      error: "Pose generation failed"
    });
  }
};
