// src/api/p2m/reel/generate-carousel.ts

import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

import { carouselKenBurnsV2Service }
from "../../../magicreel/services/carouselKenBurnsV2.service";

import { uploadToCloudinary }
from "../../../utils/cloudinary";

export async function generateCarouselReelController(
  req: Request,
  res: Response
) {
  try {
    const { lookbookId } = req.body;

    if (!lookbookId) {
      return res.status(400).json({
        success: false,
        error: "lookbookId is required",
      });
    }

    const renders = await prisma.render.findMany({
      where: {
        lookbookId,
        status: "completed",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!renders.length) {
      return res.status(404).json({
        success: false,
        error: "No completed renders found",
      });
    }

    const imageUrls = renders
      .map((r) => r.outputImageUrl)
      .filter(Boolean) as string[];

    console.log("================================");
    console.log("🎬 CAROUSEL REEL START");
    console.log("LOOKBOOK:", lookbookId);
    console.log("IMAGES:", imageUrls.length);
    console.log("================================");

    const reelResult =
      await carouselKenBurnsV2Service.generate({
        imageUrls,
      });

    console.log(
      "🎬 REEL GENERATED:",
      reelResult.finalVideoPath
    );

    const uploaded =
      await uploadToCloudinary(
        reelResult.finalVideoPath,
        {
          folder: "magicreel/reels",
          resource_type: "video",
        }
      );

    console.log(
      "☁️ REEL UPLOADED:",
      uploaded.secure_url
    );

    return res.status(200).json({
      success: true,
      lookbookId,
      imageCount: imageUrls.length,
      videoUrl: uploaded.secure_url,
    });

  } catch (error: any) {
    console.error(
      "❌ Carousel Reel Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Carousel reel failed",
    });
  }
}