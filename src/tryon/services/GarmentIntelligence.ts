import sharp from "sharp";
import fs from "fs";
import path from "path";

export type GarmentProfile = {
  category: "one-pieces" | "auto";
  garmentPhotoType: "flat-lay" | "model";
  segmentationFree: boolean;
};

export class GarmentIntelligence {
  static resolveGarmentProfile(): GarmentProfile {
    return {
      category: "one-pieces",
      garmentPhotoType: "flat-lay",
      segmentationFree: false
    };
  }

  static async padGarment(
    inputPath: string,
    outputPath: string
  ): Promise<void> {
    const image = sharp(inputPath);
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      throw new Error("Invalid garment image dimensions");
    }

    const bottomPadding = Math.floor(meta.height * 0.35);
    const sidePadding = Math.floor(meta.width * 0.15);

    await image
      .extend({
        top: 0,
        bottom: bottomPadding,
        left: sidePadding,
        right: sidePadding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
  }
}
