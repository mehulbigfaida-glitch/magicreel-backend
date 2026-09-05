// src/magicreel/services/carouselKenBurnsV2.service.ts

import fs from "fs";
import path from "path";
import https from "https";
import { spawn } from "child_process";

import { ffmpegPath } from "../../utils/ffmpegPath";
import { generatePremiumCarouselReel } from "./premiumCarouselConcat.service";

/**
 * Reference-matched fashion camera language for the Ecom Carousel Reel.
 * The proven reference is 3:4 / 1080x1440 and approximately 15 seconds.
 */
const MOTION_PRESETS = [
  {
    name: "front-bottom-to-top",
    z: "1.04+0.06*((1-cos(PI*on/(duration-1)))/2)",
    x: "(iw-iw/zoom)/2",
    y: "(ih-ih/zoom)*(1-((1-cos(PI*on/(duration-1)))/2))",
  },
  {
    name: "back-top-to-bottom",
    z: "1.04+0.06*((1-cos(PI*on/(duration-1)))/2)",
    x: "(iw-iw/zoom)/2",
    y: "(ih-ih/zoom)*((1-cos(PI*on/(duration-1)))/2)",
  },
  {
    name: "pose-bottom-to-top",
    z: "1.03+0.05*((1-cos(PI*on/(duration-1)))/2)",
    x: "(iw-iw/zoom)*0.52",
    y: "(ih-ih/zoom)*(1-((1-cos(PI*on/(duration-1)))/2))",
  },
  {
    name: "pose-top-to-bottom",
    z: "1.03+0.05*((1-cos(PI*on/(duration-1)))/2)",
    x: "(iw-iw/zoom)*0.48",
    y: "(ih-ih/zoom)*((1-cos(PI*on/(duration-1)))/2)",
  },
  {
    name: "elegant-diagonal",
    z: "1.03+0.05*((1-cos(PI*on/(duration-1)))/2)",
    x: "(iw-iw/zoom)*(1-((1-cos(PI*on/(duration-1)))/2))",
    y: "(ih-ih/zoom)*((1-cos(PI*on/(duration-1)))/2)",
  },
  {
    name: "detail-push",
    z: "1.04+0.07*((1-cos(PI*on/(duration-1)))/2)",
    x: "(iw-iw/zoom)/2",
    y: "(ih-ih/zoom)/2",
  },
];

export const carouselKenBurnsV2Service = {
  async generate({ imageUrls }: { imageUrls: string[] }) {
    if (!imageUrls?.length) throw new Error("imageUrls required");

    const tempDir = path.join(process.cwd(), "storage", "carousel-reel-v2", Date.now().toString());
    fs.mkdirSync(tempDir, { recursive: true });

    const clipPaths: string[] = [];
    const clipDuration = 2.6;
    const fps = 30;
    const totalFrames = Math.round(clipDuration * fps);

    for (let i = 0; i < imageUrls.length; i++) {
      const imagePath = path.join(tempDir, `image-${i + 1}.jpg`);
      const clipPath = path.join(tempDir, `clip-${i + 1}.mp4`);
      const motion = MOTION_PRESETS[i % MOTION_PRESETS.length];

      console.log(`⬇️ Downloading image ${i + 1}/${imageUrls.length}`);
      console.log(`🎥 Camera move: ${motion.name}`);
      await downloadFile(imageUrls[i], imagePath);

      const zoomPan =
        `zoompan=z='${motion.z}':` +
        `x='${motion.x}':` +
        `y='${motion.y}':` +
        `d=${totalFrames}:s=1080x1440:fps=${fps}`;

      const filter = [
        "scale=1080:1440:force_original_aspect_ratio=increase",
        "crop=1080:1440",
        zoomPan,
        "eq=contrast=1.02:saturation=1.015:brightness=0.003",
        "vignette=PI/8",
        "format=yuv420p",
        "setsar=1",
        "settb=AVTB",
        "setpts=PTS-STARTPTS",
      ].join(",");

      const args = [
        "-y", "-loop", "1", "-i", imagePath,
        "-t", clipDuration.toFixed(2), "-vf", filter,
        "-r", String(fps), "-c:v", "libx264", "-preset", "medium",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", clipPath,
      ];

      console.log(`🎬 Creating ${motion.name} clip ${i + 1}/${imageUrls.length}`);
      await new Promise<void>((resolve, reject) => {
        const ff = spawn(ffmpegPath, args);
        ff.stderr.on("data", (d) => console.log(`[clip-${i + 1}]`, d.toString()));
        ff.on("close", (code) => code === 0 ? resolve() : reject(new Error(`Clip generation failed: ${code}`)));
        ff.on("error", reject);
      });
      clipPaths.push(clipPath);
    }

    const finalVideoPath = await generatePremiumCarouselReel(clipPaths, tempDir);
    return { finalVideoPath, tempDir };
  },
};
