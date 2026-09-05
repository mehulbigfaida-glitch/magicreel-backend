// src/magicreel/services/carouselKenBurnsV2.service.ts

import fs from "fs";
import path from "path";
import https from "https";
import { spawn } from "child_process";

import { ffmpegPath } from "../../utils/ffmpegPath";
import { magicReelConcatService } from "../../video/services/magicReelConcat.service";

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

/** Premium fashion-carousel motion presets. */
const MOTION_PRESETS = [
  { name: "hero-push", z: "1.00+0.00022*on", x: "(iw-iw/zoom)/2", y: "(ih-ih/zoom)/2" },
  { name: "left-drift", z: "1.04+0.00018*on", x: "(iw-iw/zoom)*0.78", y: "(ih-ih/zoom)/2" },
  { name: "right-drift", z: "1.04+0.00018*on", x: "(iw-iw/zoom)*0.22", y: "(ih-ih/zoom)/2" },
  { name: "upward-drift", z: "1.03+0.00020*on", x: "(iw-iw/zoom)/2", y: "(ih-ih/zoom)*0.72" },
  { name: "diagonal", z: "1.02+0.00020*on", x: "(iw-iw/zoom)*0.70", y: "(ih-ih/zoom)*0.68" },
  { name: "detail-push", z: "1.00+0.00030*on", x: "(iw-iw/zoom)/2", y: "(ih-ih/zoom)/2" },
];

const TRANSITIONS = ["smoothleft", "dissolve", "slideleft", "circleopen", "wipeleft"];

export const carouselKenBurnsV2Service = {
  async generate({ imageUrls }: { imageUrls: string[] }) {
    if (!imageUrls?.length) throw new Error("imageUrls required");

    const tempDir = path.join(process.cwd(), "storage", "carousel-reel-v2", Date.now().toString());
    fs.mkdirSync(tempDir, { recursive: true });

    const clipPaths: string[] = [];
    const clipDuration = 2.15;
    const transitionDuration = 0.55;
    const fps = 30;
    const totalFrames = Math.round(clipDuration * fps);

    for (let i = 0; i < imageUrls.length; i++) {
      const imagePath = path.join(tempDir, `image-${i + 1}.jpg`);
      const clipPath = path.join(tempDir, `clip-${i + 1}.mp4`);
      const motion = MOTION_PRESETS[i % MOTION_PRESETS.length];

      console.log(`⬇️ Downloading image ${i + 1}/${imageUrls.length}`);
      console.log("🎬 REEL IMAGE URL:", imageUrls[i]);
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
        "eq=contrast=1.025:saturation=1.02:brightness=0.005",
        "vignette=PI/5",
        "format=yuv420p",
        "setsar=1",
        "settb=AVTB",
        "setpts=PTS-STARTPTS",
      ].join(",");

      const args = [
        "-y", "-loop", "1", "-i", imagePath,
        "-t", clipDuration.toFixed(2),
        "-vf", filter,
        "-r", String(fps),
        "-c:v", "libx264", "-preset", "medium",
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

    const finalVideoPath = await magicReelConcatService.generateMagicReel({
      clips: clipPaths,
      outputDir: tempDir,
      transitionDuration,
      transitions: TRANSITIONS,
    });

    return { finalVideoPath, tempDir };
  },
};
