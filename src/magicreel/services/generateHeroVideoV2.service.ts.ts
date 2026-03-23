import fs from "fs";
import path from "path";
import { klingVideoService } from "../../video/services/klingVideo.service";

export async function generateHeroVideoV2(
  heroImagePath: string,
  outputBaseDir: string
): Promise<string> {
  if (!fs.existsSync(heroImagePath)) {
    throw new Error("Hero image not found");
  }

  const heroDir = path.join(outputBaseDir, "hero");
  fs.mkdirSync(heroDir, { recursive: true });

  const heroVideoPath = path.join(heroDir, "hero.mp4");

  await klingVideoService.generateClip({
    imagePath: heroImagePath,
    outputVideoPath: heroVideoPath,
  });

  if (!fs.existsSync(heroVideoPath)) {
    throw new Error("Hero video generation failed");
  }

  return heroVideoPath;
}
