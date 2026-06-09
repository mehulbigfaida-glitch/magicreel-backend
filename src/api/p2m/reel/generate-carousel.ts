// src/api/p2m/reel/generate-carousel.ts

import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

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

    return res.status(200).json({
      success: true,
      lookbookId,
      imageCount: imageUrls.length,
      imageUrls,
    });

  } catch (error: any) {
    console.error("❌ Carousel Reel Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Carousel reel failed",
    });
  }
}