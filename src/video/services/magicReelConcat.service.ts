import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { ffmpegPath } from "../../utils/ffmpegPath";

interface MagicReelConcatInput {
  clips: string[];
  outputDir: string;
}

export class MagicReelConcatService {
  async generateMagicReel(
    input: MagicReelConcatInput
  ): Promise<string> {
    const { clips, outputDir } = input;

    if (clips.length < 2) {
      throw new Error(
        "At least 2 clips are required"
      );
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }

    const outputVideoPath = path.join(
      outputDir,
      "magicreel.mp4"
    );

    const inputs = clips
      .map(
        (clip) =>
          `-i "${clip.replace(/\\/g, "/")}"`
      )
      .join(" ");

    let filter = "";

    for (let i = 0; i < clips.length; i++) {
      filter += `[${i}:v]`;
    }

    const fadeDuration = 0.75;
const clipDuration = 2.5;

    let current = "[0:v]";

    const filterParts: string[] = [];

    for (let i = 1; i < clips.length; i++) {
      const offset =
        i * (clipDuration - fadeDuration);

      const out =
        i === clips.length - 1
          ? "[v]"
          : `[v${i}]`;

      filterParts.push(
        `${current}[${i}:v]xfade=transition=fade:duration=${fadeDuration}:offset=${offset}${out}`
      );

      current = out;
    }

    const ffmpegCommand =
  `"${ffmpegPath}" -y ${inputs} ` +
      `-filter_complex "${filterParts.join(
        ";"
      )}" ` +
      `-map "[v]" ` +
      `-c:v libx264 ` +
      `-preset medium ` +
      `-pix_fmt yuv420p ` +
      `"${outputVideoPath}"`;

    console.log(
      "🎞️ Crossfade Reel FFmpeg"
    );
    console.log(ffmpegCommand);

    await new Promise<void>(
      (resolve, reject) => {
        exec(
          ffmpegCommand,
          (error, stdout, stderr) => {
            if (error) {
              console.error(stderr);
              reject(error);
            } else {
              resolve();
            }
          }
        );
      }
    );

    return outputVideoPath;
  }
}

export const magicReelConcatService =
  new MagicReelConcatService();