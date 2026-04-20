import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {
  try {
    // HERO
    const heroJobs = await prisma.productToModelJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // REEL
    const reelJobs = await prisma.render.findMany({
      where: {
        type: "REEL",
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    
  // LOOKBOOK BASE
const lookbookJobs = await prisma.lookbook.findMany({
  orderBy: { createdAt: "desc" },
  take: 30,
});

const lookbookPredictions = await Promise.all(
  lookbookJobs.map(async (lb: any) => {
    const renders = await prisma.render.findMany({
      where: {
        lookbookId: lb.id,
        type: "LOOKBOOK",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // ✅ ONLY pose images
    const lookbookImages = renders
      .map((r) => r.outputImageUrl)
      .filter((url) => !!url);

    // ✅ HERO MUST COME FROM INPUT IMAGE
    const heroImageUrl =
      lb.inputImageUrl ||
      lookbookImages[0] ||
      "https://via.placeholder.com/300x450?text=Lookbook";

    return {
      id: lb.id,
      type: "lookbook",
      status: "completed",

      // ✅ FINAL STRUCTURE
      heroImageUrl,
      lookbookImages,

      createdAt: lb.createdAt,
    };
  })
);

    const predictions = [
      // HERO
      ...heroJobs.map((job) => ({
        id: job.id,
        type: "hero",
        status: job.status,
        mediaUrl: job.resultImageUrl,
        createdAt: job.createdAt,
      })),

      // REEL
      ...reelJobs.map((job) => ({
        id: job.id,
        type: "reel",
        status: job.status || "completed",
        mediaUrl: job.reelVideoUrl ?? null,
        createdAt: job.createdAt,
      })),

      // LOOKBOOK
      ...lookbookPredictions,
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