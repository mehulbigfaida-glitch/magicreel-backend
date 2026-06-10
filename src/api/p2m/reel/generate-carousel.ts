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

    // =====================================
    // USE ONLY REAL CLOUDINARY LOOKBOOK IMAGES
    // FILTER OUT HERO BASE64 ROWS
    // =====================================

    const imageUrls = renders
      .map((r) => r.outputImageUrl)
      .filter(
        (url): url is string =>
          typeof url === "string" &&
          url.startsWith("https://")
      );

    console.log("================================");
    console.log("🎬 CAROUSEL REEL START");
    console.log("LOOKBOOK:", lookbookId);
    console.log("TOTAL RENDERS:", renders.length);
    console.log("VALID IMAGES:", imageUrls.length);
    console.log("================================");

    console.log("IMAGE URLS");
    console.log(imageUrls);

    if (!imageUrls.length) {
      return res.status(400).json({
        success: false,
        error: "No valid Cloudinary images found",
      });
    }

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

    const reelRender =
      await prisma.render.create({
        data: {
          lookbookId,

          pose: "REEL",
          engine: "FFMPEG",

          modelImageUrl: "",
          garmentImageUrl: "",

          status: "completed",

          type: "REEL",

          reelVideoUrl:
            uploaded.secure_url,
        },
      });

    console.log(
      "✅ REEL SAVED TO DB:",
      uploaded.secure_url
    );

    return res.status(200).json({
      success: true,

      reelId:
        reelRender.id,

      lookbookId,

      imageCount:
        imageUrls.length,

      videoUrl:
        uploaded.secure_url,
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