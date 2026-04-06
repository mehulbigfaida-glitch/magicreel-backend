import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {
  try {

    // HERO
    const heroJobs = await prisma.productToModelJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // REEL (stored in render table)
    const reelJobs = await prisma.render.findMany({
      where: {
        outputImageUrl: { not: null },
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

      // REEL
      ...reelJobs.map((job) => ({
        id: job.id,
        type: "reel",
        status: "completed",
        mediaUrl: job.outputImageUrl,
        createdAt: job.createdAt,
      })),

    ];

    // Sort latest first
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