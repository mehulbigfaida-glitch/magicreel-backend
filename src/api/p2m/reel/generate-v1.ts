import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";
import { reelV1Service } from "../../../magicreel/services/reelV1.service";

const db = prisma as any;

export async function generateReelV1Controller(
  req: Request,
  res: Response
) {
  try {
    const { jobId, heroPreviewUrl } = req.body;

    if (!jobId || !heroPreviewUrl) {
      return res.status(400).json({
        error: "Missing params",
      });
    }

    // ✅ CREATE JOB
    await db.reelJob.create({
      data: {
        id: jobId,
        status: "processing",
        inputImageUrl: heroPreviewUrl,
      },
    });

    // ✅ RETURN FAST
    res.json({ success: true });

    // 🔥 BACKGROUND TASK
    (async () => {
      try {
        console.log("🎬 Starting Reel:", jobId);

        const result = await reelV1Service.generate({
          imageUrl: heroPreviewUrl,
        });

        await db.reelJob.update({
          where: { id: jobId },
          data: {
            status: "completed",
            reelVideoUrl: result.reelVideoUrl,
          },
        });

        console.log("✅ Reel Done");

      } catch (err) {
        console.error("❌ Reel failed:", err);

        await db.reelJob.update({
          where: { id: jobId },
          data: { status: "failed" },
        });
      }
    })();

  } catch (error) {
    console.error("Controller error:", error);

    return res.status(500).json({
      error: "Reel generation failed",
    });
  }
}