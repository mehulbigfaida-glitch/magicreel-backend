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

    console.log("Polling hero runId:", runId);

    if (!runId) {
      return res.status(400).json({
        error: "runId missing",
      });
    }

    /* =========================
       FIND JOB
    ========================= */

    const job = await prisma.productToModelJob.findFirst({
      where: {
        engineJobId: runId,
      },
    });

    /* =========================
       JOB NOT FOUND
    ========================= */

    if (!job) {

      console.warn("Hero job not found in DB.");

      // allow short delay for DB writes
      return res.json({
        status: "processing",
      });

    }

    /* =========================
       RETURN CACHED RESULT
    ========================= */

    if (job.status === "completed" && job.resultImageUrl) {

      console.log("Hero already completed. Returning cached result.");

      return res.json({
        status: "completed",
        imageUrl: job.resultImageUrl,
      });

    }

    /* =========================
       CHECK FASHN STATUS
    ========================= */

    const statusResult = await fashn.pollStatus(runId);

    console.log("FASHN status:", statusResult.status);

    if (
      statusResult.status === "pending" ||
      statusResult.status === "running"
    ) {
      return res.json({
        status: "processing",
      });
    }

    /* =========================
       HANDLE FAILURE
    ========================= */

    if (statusResult.status === "failed") {

      console.log("FASHN job failed");

      await prisma.productToModelJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
        },
      });

      return res.json({
        status: "failed",
      });

    }

    /* =========================
       HANDLE COMPLETION
    ========================= */

    if (statusResult.status === "completed") {

      const imageUrl = statusResult.output?.[0];

      console.log("FASHN completed. Output URL:", imageUrl);

      if (!imageUrl) {
        return res.status(500).json({
          error: "FASHN returned no image",
        });
      }

      console.log("Uploading to Cloudinary...");

      const upload = await cloudinary.uploader.upload(imageUrl, {
        folder: "magicreel/heroes",
      });

      const cloudinaryUrl = upload.secure_url;

      console.log("Cloudinary upload successful:", cloudinaryUrl);

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

    return res.json({
      status: "processing",
    });

  } catch (error) {

    console.error("Hero Poll Error:", error);

    return res.status(500).json({
      error: "Hero polling failed",
    });

  }
}