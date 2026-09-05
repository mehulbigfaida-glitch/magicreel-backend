import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { ffmpegPath } from "../../utils/ffmpegPath";

interface MagicReelConcatInput {
  clips: string[];
  outputDir: string;
  transitionDuration?: number;
  transitions?: string[];
}

export class MagicReelConcatService {
  async generateMagicReel(input: MagicReelConcatInput): Promise<string> {
    const {
      clips,
      outputDir,
      transitionDuration = 0.75,
      transitions = ["fade"],
    } = input;

    if (clips.length < 2) throw new Error("At least 2 clips are required");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputVideoPath = path.join(outputDir, "magicreel.mp4");
    const inputs = clips.map((clip) => `-i "${clip.replace(/\\/g, "/")}"`).join(" ");
    const clipDuration = 2.15;

    let current = "[0:v]";
    const filterParts: string[] = [];

    for (let i = 1; i < clips.length; i++) {
      const offset = i * (clipDuration - transitionDuration);
      const out = i === clips.length - 1 ? "[v]" : `[v${i}]`;
      const transition = transitions[(i - 1) % transitions.length] || "fade";
      filterParts.push(
        `${current}[${i}:v]xfade=transition=${transition}:duration=${transitionDuration}:offset=${offset}${out}`
      );
      current = out;
    }

    const ffmpegCommand =
      `"${ffmpegPath}" -y ${inputs} ` +
      `-filter_complex "${filterParts.join(";")}" ` +
      `-map "[v]" -c:v libx264 -preset medium -pix_fmt yuv420p -movflags +faststart ` +
      `"${outputVideoPath}"`;

    console.log("🎞️ Premium Carousel Reel transitions");
    console.log(`🎞️ CLIPS: ${clips.length}`);
    console.log(`🎞️ TRANSITIONS: ${transitions.join(", ")}`);
    console.log(`🎞️ EXPECTED DURATION: ${(clips.length * clipDuration - (clips.length - 1) * transitionDuration).toFixed(2)}s`);
    console.log(ffmpegCommand);

    await new Promise<void>((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
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
}

export const magicReelConcatService = new MagicReelConcatService();
