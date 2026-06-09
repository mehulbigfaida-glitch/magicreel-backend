import { Request, Response } from "express";
import path from "path";

import { carouselKenBurnsService } from "../../../magicreel/services/carouselKenBurns.service";

export async function testKenBurnsController(
  req: Request,
  res: Response
) {
  try {
    const imagePath = path.join(
      process.cwd(),
      "storage",
      "test",
      "hero.jpg"
    );

    const outputVideoPath = path.join(
      process.cwd(),
      "storage",
      "test",
      "output.mp4"
    );

    await carouselKenBurnsService.generateClip({
      imagePath,
      outputVideoPath,
      durationSeconds: 2,
      fps: 30,
    });

    return res.status(200).json({
      success: true,
      imagePath,
      outputVideoPath,
    });
  } catch (error: any) {
    console.error("❌ Ken Burns Test Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}