import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";
import { v2 as cloudinary } from "cloudinary";

const db = prisma!;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export async function generateReelV1(req: Request, res: Response) {
  try {

    const { jobId, heroPreviewUrl } = req.body;

    if (!jobId || !heroPreviewUrl) {
      return res.status(400).json({
        error: "jobId and heroPreviewUrl required",
      });
    }

    /* =========================
       CREATE JOB
    ========================= */

    await db.reelJob.create({
      data: {
        id: jobId,
        status: "processing",
        inputImageUrl: heroPreviewUrl,
      },
    });

    /* =========================
       ASYNC PROCESS (NON-BLOCKING)
    ========================= */

    (async () => {
      try {

        console.log("🎬 Reel job started:", jobId);

        // 🔥 TEMP: simulate reel generation (replace later with Kling)
        const videoUrl = heroPreviewUrl;

        console.log("Uploading to Cloudinary...");

        const upload = await cloudinary.uploader.upload(videoUrl, {
          resource_type: "video",
          folder: `magicreel/${jobId}/reel`,
        });

        const finalUrl = upload.secure_url;

        await db.reelJob.update({
          where: { id: jobId },
          data: {
            status: "completed",
            reelVideoUrl: finalUrl,
          },
        });

        console.log("✅ Reel completed:", finalUrl);

      } catch (err) {

        console.error("❌ Reel job failed:", err);

        await db.reelJob.update({
          where: { id: jobId },
          data: {
            status: "failed",
          },
        });

      }
    })();

    /* =========================
       IMMEDIATE RESPONSE
    ========================= */

    return res.json({
      success: true,
      jobId,
    });

  } catch (error) {

    console.error("Generate Reel Error:", error);

    return res.status(500).json({
      error: "Reel generation failed",
    });

  }
}