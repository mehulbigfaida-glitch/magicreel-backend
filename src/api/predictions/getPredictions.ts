import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {
  try {

    // HERO (productToModel)
    const heroJobs = await prisma.productToModelJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // REEL (Render table with type REEL)
    const reelJobs = await prisma.render.findMany({
  where: {
    type: "REEL", // ✅ keep type filter only
  },
  orderBy: { createdAt: "desc" },
  take: 30,
});

    const predictions = [

      // HERO
      ...heroJobs.map((job) => ({
        id: job.id,
        type: "hero",
        status: job.status,
        mediaUrl: job.resultImageUrl,
        createdAt: job.createdAt,
      })),

      // REEL ✅ FIXED
      ...reelJobs.map((job) => ({
  id: job.id,
  type: "reel",
  status: job.status || "completed", // ✅ use real status

  mediaUrl: job.reelVideoUrl ?? null, // ✅ allow null for placeholder

  createdAt: job.createdAt,
})),

    ];

    // SORT LATEST FIRST
    predictions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    return res.json(predictions);

  } catch (error) {
    console.error("❌ Predictions error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch predictions",
    });
  }
};