import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

const db = prisma as any;

export async function generateReelV1Controller(req: Request, res: Response) {
  try {
    const { jobId, heroPreviewUrl } = req.body;

    if (!jobId || !heroPreviewUrl) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    // create job
    await db.reelJob.create({
      data: {
        id: jobId,
        status: "processing",
        inputImageUrl: heroPreviewUrl,
      },
    });

    // simulate async reel generation (replace with Kling later)
    setTimeout(async () => {
      try {
        // ⚠️ TEMP: use same image as video placeholder
        await db.reelJob.update({
          where: { id: jobId },
          data: {
            status: "completed",
            reelVideoUrl: heroPreviewUrl, // replace later
          },
        });
      } catch (err) {
        console.error("Reel async error:", err);
      }
    }, 60000);

    return res.json({
      success: true,
      jobId,
    });

  } catch (error) {
    console.error("Reel generation error:", error);

    return res.status(500).json({
      error: "Reel generation failed",
    });
  }
}