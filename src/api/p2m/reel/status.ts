import { Request, Response } from "express";
import prisma from "../../../magicreel/db/prisma";

const db = prisma as any;

export async function getReelStatus(req: Request, res: Response) {
  try {
    const { jobId } = req.params;

    const job = await db.reelJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.json({ status: "processing" });
    }

    if (job.status === "completed") {
      return res.json({
        status: "completed",
        reelVideoUrl: job.reelVideoUrl,
      });
    }

    if (job.status === "failed") {
      return res.json({ status: "failed" });
    }

    return res.json({ status: "processing" });

  } catch (error) {
    console.error("Reel status error:", error);

    return res.status(500).json({
      error: "Status check failed",
    });
  }
}