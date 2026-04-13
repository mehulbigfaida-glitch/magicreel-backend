import { prisma } from "../../../magicreel/db/prisma";
import { Request, Response } from "express";
import { FashnService } from "../../../magicreel/services/fashn.service";
import { v2 as cloudinary } from "cloudinary";

const fashn = new FashnService();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export async function pollHeroGeneration(req: Request, res: Response) {
  try {
    const { runId } = req.params;

    if (!runId) {
      return res.status(400).json({ error: "runId missing" });
    }

    console.log("Polling hero runId:", runId);

    /* =========================
       FIND JOB
    ========================= */

    const job = await prisma.productToModelJob.findFirst({
      where: { engineJobId: runId },
    });

    if (!job) {
      console.warn("Hero job not found yet (DB delay)");
      return res.json({ status: "processing" });
    }

    /* =========================
       RETURN CACHED RESULT
    ========================= */

    if (job.status === "completed" && job.resultImageUrl) {
      return res.json({
        status: "completed",
        imageUrl: job.resultImageUrl,
      });
    }

    if (job.status === "failed") {
      return res.json({ status: "failed" });
    }

    /* =========================
       FASHN STATUS
    ========================= */

    let statusResult;

    try {
      statusResult = await fashn.pollStatus(runId);
    } catch (err: any) {
      console.error("❌ FASHN POLL ERROR:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      // 🔴 STOP LOOP — FAIL FAST
      await prisma.productToModelJob.update({
        where: { id: job.id },
        data: { status: "failed" },
      });

      return res.json({
        status: "failed",
        error: "FASHN polling failed",
      });
    }

    if (!statusResult || !statusResult.status) {
      return res.json({ status: "processing" });
    }

    const status = statusResult.status;

    /* =========================
       PROCESSING
    ========================= */

    if (status === "pending" || status === "running") {
      return res.json({ status: "processing" });
    }

    /* =========================
       FAILURE
    ========================= */

    if (status === "failed") {
      await prisma.productToModelJob.update({
        where: { id: job.id },
        data: { status: "failed" },
      });

      return res.json({ status: "failed" });
    }

    /* =========================
       COMPLETED
    ========================= */

    if (status === "completed" || status === "succeeded") {
      const imageUrl = Array.isArray(statusResult.output)
        ? statusResult.output[0]
        : statusResult.output || null;

      if (!imageUrl) {
        return res.json({ status: "processing" });
      }

      console.log("Uploading to Cloudinary...");

      const upload = await cloudinary.uploader.upload(imageUrl, {
        folder: "magicreel/heroes",
      });

      const cloudinaryUrl = upload.secure_url;

      await prisma.productToModelJob.update({
        where: { id: job.id },
        data: {
          status: "completed",
          resultImageUrl: cloudinaryUrl,
        },
      });

      return res.json({
        status: "completed",
        imageUrl: cloudinaryUrl,
      });
    }

    return res.json({ status: "processing" });

  } catch (error: any) {
    console.error("❌ HERO POLL CRASH:", error.message);

    return res.status(500).json({
      status: "failed",
      error: "Internal poll error",
    });
  }
}