import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getShareData = async (req: Request, res: Response) => {
  try {
    const { runId } = req.params;

    if (!runId) {
      return res.status(400).json({ error: "runId is required" });
    }

    const job = await prisma.render.findUnique({
      where: { id: runId }, // ✅ FIXED
    });

    if (!job) {
      return res.status(404).json({ error: "Run not found" });
    }

    return res.json({
      runId: job.id, // ✅ FIXED
      type: job.type,
      status: job.status,
      outputs: {
        heroImage: job.outputImageUrl || null,   // ✅ FIXED
        lookbookImages: [],                      // ⚠️ will handle later
        reelVideo: job.reelVideoUrl || null,     // ✅ FIXED
      },
    });
  } catch (error) {
    console.error("Share API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};