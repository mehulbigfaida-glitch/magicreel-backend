import { exec } from "child_process";
import fs from "fs";
import path from "path";

interface ImageToVideoInput {
  imagePath: string;
  outputVideoPath: string;
  durationSeconds?: number;
}

export class ImageToVideoClipService {
  async generateClip(input: ImageToVideoInput): Promise<void> {
    const { imagePath, outputVideoPath } = input;
    const duration = input.durationSeconds ?? 2;

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    const outputDir = path.dirname(outputVideoPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // IMPORTANT:
    // Windows-safe, single-line FFmpeg command
    const ffmpegCommand =
      `ffmpeg -y -loop 1 -i "${imagePath}" ` +
      `-vf zoompan=z=1.001:d=${duration * 30}:s=1080x1920 ` +
      `-t ${duration} -r 30 -pix_fmt yuv420p "${outputVideoPath}"`;

    await new Promise<void>((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg image→video error:", stderr || error.message);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export const imageToVideoClipService =
  new ImageToVideoClipService();
