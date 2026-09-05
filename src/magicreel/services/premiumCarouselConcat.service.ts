import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { ffmpegPath } from "../../utils/ffmpegPath";

// Reference Reel: 6 x 2.60s with 0.10s overlaps = 15.10s total.
const CLIP_DURATION = 2.60;
const TRANSITION_DURATION = 0.10;
const TRANSITIONS = ["fade", "smoothleft", "dissolve", "wipeleft", "fade"];

export async function generatePremiumCarouselReel(clips: string[], outputDir: string): Promise<string> {
  if (clips.length < 2) throw new Error("At least 2 clips are required");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputVideoPath = path.join(outputDir, "magicreel-premium.mp4");
  const inputs = clips.map((clip) => `-i "${clip.replace(/\\/g, "/")}"`).join(" ");
  let current = "[0:v]";
  const filterParts: string[] = [];

  for (let i = 1; i < clips.length; i++) {
    const offset = i * (CLIP_DURATION - TRANSITION_DURATION);
    const out = i === clips.length - 1 ? "[v]" : `[v${i}]`;
    const transition = TRANSITIONS[(i - 1) % TRANSITIONS.length];
    filterParts.push(`${current}[${i}:v]xfade=transition=${transition}:duration=${TRANSITION_DURATION}:offset=${offset}${out}`);
    current = out;
  }

  const command =
    `"${ffmpegPath}" -y ${inputs} ` +
    `-filter_complex "${filterParts.join(";")}" ` +
    `-map "[v]" -c:v libx264 -preset medium -pix_fmt yuv420p -movflags +faststart ` +
    `"${outputVideoPath}"`;

  console.log("🎞️ PREMIUM CAROUSEL EDIT — PROVEN REFERENCE TIMING");
  console.log(`🎞️ CLIPS: ${clips.length}`);
  console.log(`🎞️ CANVAS: 1080x1440 (3:4)`);
  console.log(`🎞️ CLIP DURATION: ${CLIP_DURATION.toFixed(2)}s`);
  console.log(`🎞️ TRANSITION DURATION: ${TRANSITION_DURATION.toFixed(2)}s`);
  console.log(`🎞️ TRANSITIONS: ${TRANSITIONS.join(", ")}`);
  console.log(`🎞️ EXPECTED DURATION: ${(clips.length * CLIP_DURATION - (clips.length - 1) * TRANSITION_DURATION).toFixed(2)}s`);

  await new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      } else {
        resolve();
      }
    });
  });

  return outputVideoPath;
}
