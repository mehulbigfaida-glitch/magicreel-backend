// src/magicreel/services/carouselKenBurnsV2.service.ts

import fs from "fs";
import path from "path";
import https from "https";
import { spawn } from "child_process";

import { ffmpegPath } from "../../utils/ffmpegPath";
import { generatePremiumCarouselReel } from "./premiumCarouselConcat.service";

function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        file.close();
        try { fs.unlinkSync(outputPath); } catch {}
        response.resume();
        reject(new Error(`Image download failed: HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      try { fs.unlinkSync(outputPath); } catch {}
      reject(err);
    });
  });
}

/**
 * Premium fashion camera language for still-image Reels.
 *
 * The movement is intentionally slow and physical-looking: the virtual
 * camera travels over the garment rather than merely enlarging the image.
 * The first two scenes establish the full garment with opposing vertical
 * scans; later scenes alternate direction, lateral movement and a detail
 * push so the six-image pack feels like one fashion film.
 */
const MOTION_PRESETS = [
  {
    name: "front-bottom-to-top",
    z: "1.12+0.18*((1-cos(PI*on/(d-1)))/2)",
    x: "(iw-iw/zoom)/2",
    y: "(ih-ih/zoom)*(1-((1-cos(PI*on/(d-1)))/2))",
  },
  {
    name: "back-top-to-bottom",
    z: "1.12+0.18*((1-cos(PI*on/(d-1)))/2)",
    x: "(iw-iw/zoom)/2",
    y: "(ih-ih/zoom)*((1-cos(PI*on/(d-1)))/2)",
  },
  {
    name: "pose-bottom-to-top",
    z: "1.10+0.16*((1-cos(PI*on/(d-1)))/2)",
    x: "(iw-iw/zoom)*0.52",
    y: "(ih-ih/zoom)*(1-((1-cos(PI*on/(d-1)))/2))",
  },
  {
    name: "pose-top-to-bottom",
    z: "1.10+0.16*((1-cos(PI*on/(d-1)))/2)",
    x: "(iw-iw/zoom)*0.48",
    y: "(ih-ih/zoom)*((1-cos(PI*on/(d-1)))/2)",
  },
  {
    name: "elegant-diagonal",
    z: "1.08+0.12*((1-cos(PI*on/(d-1)))/2)",
    x: "(iw-iw/zoom)*(1-((1-cos(PI*on/(d-1)))/2))",
    y: "(ih-ih/zoom)*((1-cos(PI*on/(d-1)))/2)",
  },
  {
    name: "detail-push",
    z: "1.05+0.20*((1-cos(PI*on/(d-1)))/2)",
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
    const clipDuration = 3.3;
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
        `d=${totalFrames}:s=1080x1920:fps=${fps}`;

      const filter = [
        "scale=1080:1920:force_original_aspect_ratio=increase",
        "crop=1080:1920",
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
