import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { carouselKenBurnsV2Service } from "./carouselKenBurnsV2.service";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const carouselReelService = {
  async generate({
    imageUrls,
  }: {
    imageUrls: string[];
  }) {
    if (!imageUrls?.length) {
      throw new Error("imageUrls required");
    }

    console.log(
      `🎬 Generating Carousel Reel (${imageUrls.length} images)`
    );

    const {
      finalVideoPath,
      tempDir,
    } = await carouselKenBurnsV2Service.generate({
      imageUrls,
    });

    console.log("☁️ Uploading reel...");

    const upload =
      await cloudinary.uploader.upload(
        finalVideoPath,
        {
          resource_type: "video",
          folder: "magicreel/carousel-reels",
        }
      );

    try {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      });
    } catch {}

    return {
      reelVideoUrl:
        upload.secure_url ||
        upload.url ||
        null,
    };
  },
};