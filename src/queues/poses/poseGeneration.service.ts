// src/queues/poses/poseGeneration.service.ts
// FINAL – SINGLE SOURCE OF TRUTH

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { POSE_PRESETS } from "./posePresets";

interface PoseGenerationInput {
  heroImagePath: string;
  outputDir: string;
}

export class PoseGenerationService {
  async generatePoses(
    input: PoseGenerationInput
  ): Promise<string[]> {
    const { heroImagePath, outputDir } = input;

    if (!fs.existsSync(heroImagePath)) {
      throw new Error("Hero image not found");
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const image = sharp(heroImagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid hero image");
    }

    const width = metadata.width;
    const height = metadata.height;

    const generatedImages: string[] = [];

    for (const preset of POSE_PRESETS) {
      const outputPath = path.join(
        outputDir,
        preset.outputFileName
      );

      let extractOptions = {
        left: 0,
        top: 0,
        width,
        height,
      };

      switch (preset.type) {
        case "FRONT":
          extractOptions = {
            left: Math.floor(width * 0.05),
            top: Math.floor(height * 0.02),
            width: Math.floor(width * 0.9),
            height: Math.floor(height * 0.96),
          };
          break;

        case "THREE_QUARTER":
          extractOptions = {
            left: Math.floor(width * 0.15),
            top: Math.floor(height * 0.05),
            width: Math.floor(width * 0.8),
            height: Math.floor(height * 0.9),
          };
          break;

        case "WALK":
          extractOptions = {
            left: Math.floor(width * 0.02),
            top: Math.floor(height * 0.08),
            width: Math.floor(width * 0.88),
            height: Math.floor(height * 0.92),
          };
          break;
      }

      await sharp(heroImagePath)
        .extract(extractOptions)
        .resize(1080, 1920, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255 },
        })
        .toFile(outputPath);

      generatedImages.push(outputPath);
    }

    return generatedImages;
  }
}

export const poseGenerationService =
  new PoseGenerationService();
