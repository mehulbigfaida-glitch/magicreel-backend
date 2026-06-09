import { exec } from "child_process";
import path from "path";
import fs from "fs";

interface MagicReelConcatInput {
  clips: string[]; // absolute paths to mp4 files
  outputDir: string;
}

export class MagicReelConcatService {
  async generateMagicReel(input: MagicReelConcatInput): Promise<string> {
    const { clips, outputDir } = input;

    if (clips.length < 2) {
      throw new Error("At least 2 clips are required");
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const concatFilePath = path.join(outputDir, "concat.txt");
    const outputVideoPath = path.join(outputDir, "magicreel.mp4");

    // 1️⃣ Create concat.txt
    const concatFileContent = clips
      .map((clipPath) => `file '${clipPath.replace(/\\/g, "/")}'`)
      .join("\n");

    fs.writeFileSync(concatFilePath, concatFileContent);

    // 2️⃣ FFmpeg concat command
    const ffmpegCommand = `ffmpeg -y -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputVideoPath}"`;

    // 3️⃣ Execute FFmpeg
    await new Promise<void>((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", stderr);
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
