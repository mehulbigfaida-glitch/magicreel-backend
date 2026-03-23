import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

const getPredictions = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.productToModelJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const formatted = jobs.map((job) => ({
      runId: job.engineJobId,
      heroImageUrl: job.resultImageUrl,
      status: job.status,
      createdAt: job.createdAt,
      creditsUsed: 1, // V1 fixed credit cost
    }));

    res.json({
      success: true,
      jobs: formatted,
    });

  } catch (err) {
    console.error("Predictions error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to fetch predictions",
    });
  }
};

export default getPredictions;