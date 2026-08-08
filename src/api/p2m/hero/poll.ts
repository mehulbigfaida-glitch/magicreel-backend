import { prisma } from "../../../magicreel/db/prisma";
import { Request, Response } from "express";

export async function pollHeroGeneration(
  req: Request,
  res: Response
) {
  try {

    const { runId } = req.params;

    if (!runId) {
      return res.status(400).json({
        error: "runId missing",
      });
    }

    console.log(
      "Polling MagicReel hero job:",
      runId
    );

    /* =========================
       FIND JOB
    ========================= */

    const job =
      await prisma.productToModelJob.findUnique({
        where: {
          id: runId,
        },
      });

    if (!job) {

      console.warn(
        "Hero job not found yet"
      );

      return res.json({
        status: "processing",
      });
    }

    /* =========================
       COMPLETED
    ========================= */

    if (
      job.status === "completed" &&
      job.resultImageUrl
    ) {

      return res.json({
        status: "completed",
        imageUrl: job.resultImageUrl,
      });

    }

    /* =========================
       FAILED
    ========================= */

    if (job.status === "failed") {

      return res.json({
        status: "failed",
      });

    }

    /* =========================
       PROCESSING
    ========================= */

    return res.json({
      status: "processing",
    });

  } catch (error: any) {

    console.error(
      "❌ HERO POLL CRASH:",
      error.message
    );

    return res.status(500).json({
      status: "failed",
      error: "Internal poll error",
    });

  }
}