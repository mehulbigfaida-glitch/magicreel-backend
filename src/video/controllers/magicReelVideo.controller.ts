import { Request, Response } from "express";
import path from "path";
import { magicReelConcatService } from "../services/magicReelConcat.service";

export const generateMagicReelVideo = async (
  req: Request,
  res: Response
) => {
  try {
    const { clips } = req.body;

    if (!clips || !Array.isArray(clips) || clips.length < 2) {
      return res.status(400).json({
        success: false,
        error: "clips must be an array of at least 2 video paths"
      });
    }

    // You can later make this configurable
    const outputDir = path.join(
      process.cwd(),
      "src",
      "video",
      "outputs",
      Date.now().toString()
    );

    const outputVideoPath =
      await magicReelConcatService.generateMagicReel({
        clips,
        outputDir
      });

    return res.status(200).json({
      success: true,
      outputVideoPath
    });

  } catch (error: any) {
    console.error("MagicReel video generation failed:", error.message || error);
    return res.status(500).json({
      success: false,
      error: "MagicReel video generation failed"
    });
  }
};
