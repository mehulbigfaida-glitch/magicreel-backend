// src/api/p2m/reel/generate-carousel.ts

import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

import {
  carouselKenBurnsV2Service,
} from "../../../magicreel/services/carouselKenBurnsV2.service";

import {
  uploadToCloudinary,
} from "../../../utils/cloudinary";

export async function generateCarouselReelController(
  req: Request,
  res: Response
) {
  try {

    const {
      lookbookId,
    } = req.body;

    if (!lookbookId) {
      return res.status(400).json({
        success: false,
        error: "lookbookId is required",
      });
    }

    const renders =
      await prisma.render.findMany({
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
        error:
          "No completed renders found",
      });
    }

    /*
    =====================================
    BUILD CAROUSEL SEQUENCE

    Use every completed LOOKBOOK image
    that has a valid Cloudinary URL.

    This supports both:

    4-image Lookbook:
      front
      pose_1
      pose_2
      pose_3

    5-image Lookbook:
      front
      back
      pose_1
      pose_2
      pose_3
    =====================================
    */

    const imageUrls =
      renders
        .filter(
          (render) =>
            render.type === "LOOKBOOK" &&
            typeof render.outputImageUrl ===
              "string" &&
            render.outputImageUrl.startsWith(
              "https://"
            )
        )
        .sort(
          (a, b) =>
            a.createdAt.getTime() -
            b.createdAt.getTime()
        )
        .map(
          (render) =>
            render.outputImageUrl
        )
        .filter(
          (
            url
          ): url is string =>
            typeof url === "string" &&
            url.startsWith("https://")
        );

    console.log(
      "================================"
    );

    console.log(
      "🎬 CAROUSEL REEL START"
    );

    console.log(
      "LOOKBOOK:",
      lookbookId
    );

    console.log(
      "TOTAL RENDERS:",
      renders.length
    );

    console.log(
      "VALID LOOKBOOK IMAGES:",
      imageUrls.length
    );

    console.log(
      "================================"
    );

    console.log(
      "IMAGE URLS"
    );

    console.log(
      imageUrls
    );

    /*
    =====================================
    VALIDATION

    Carousel needs at least 2 images.
    =====================================
    */

    if (imageUrls.length < 2) {
      return res.status(400).json({
        success: false,
        error:
          "At least 2 Lookbook images are required for Carousel Reel",
      });
    }

    /*
    =====================================
    GENERATE CAROUSEL REEL
    =====================================
    */

    const reelResult =
      await carouselKenBurnsV2Service.generate({
        imageUrls,
      });

    console.log(
      "🎬 REEL GENERATED:",
      reelResult.finalVideoPath
    );

    /*
    =====================================
    UPLOAD REEL
    =====================================
    */

    const uploaded =
      await uploadToCloudinary(
        reelResult.finalVideoPath,
        {
          folder:
            "magicreel/reels",

          resource_type:
            "video",
        }
      );

    console.log(
      "☁️ REEL UPLOADED:",
      uploaded.secure_url
    );

    /*
    =====================================
    HERO IMAGE FOR REEL RECORD

    Prefer the first completed Lookbook
    image because the current Lookbook
    naming is front/pose_1/... rather
    than the legacy hero/editorial names.
    =====================================
    */

    const heroImageUrl =
      imageUrls[0] || "";

    /*
    =====================================
    SAVE REEL RENDER
    =====================================
    */

    const reelRender =
      await prisma.render.create({
        data: {
          lookbookId,

          pose:
            "REEL",

          engine:
            "FFMPEG",

          modelImageUrl:
            heroImageUrl,

          garmentImageUrl:
            "",

          status:
            "completed",

          type:
            "REEL",

          reelVideoUrl:
            uploaded.secure_url,
        },
      });

    console.log(
      "✅ REEL SAVED TO DB:",
      uploaded.secure_url
    );

    /*
    =====================================
    SUCCESS
    =====================================
    */

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