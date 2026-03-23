import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { klingVideoService } from "../video/services/klingVideo.service";
import { uploadVideoToCloudinary } from "../utils/cloudinaryVideoUpload";

export interface MagicReelJobResult {
  status: "completed";
  videoPath: string;
  videoUrl: string;
}

export async function runMagicReelJob(
  heroImagePath: string,
  outputBaseDir: string
): Promise<MagicReelJobResult> {
  if (!fs.existsSync(heroImagePath)) {
    throw new Error("Hero image not found");
  }

  const clipsDir = path.join(outputBaseDir, "clips");
  fs.mkdirSync(clipsDir, { recursive: true });

  const outputVideoPath = path.join(clipsDir, "hero.mp4");

  console.log("🎥 Generating Hero video via Kling 2.1...");
  await klingVideoService.generateClip({
    imagePath: heroImagePath,
    outputVideoPath,
  });

  console.log("☁️ Uploading video to Cloudinary...");
  const videoUrl = await uploadVideoToCloudinary(outputVideoPath);

  console.log("✅ Cloudinary upload complete");

  return {
    status: "completed",
    videoPath: outputVideoPath,
    videoUrl,
  };
}
