import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Get video duration using ffprobe
 */
export async function getVideoDuration(
  filePath: string
): Promise<number | null> {
  return new Promise((resolve) => {
    const ffprobe: ChildProcessWithoutNullStreams = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);

    let output = "";
    let errorOutput = "";

    ffprobe.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });

    ffprobe.stderr.on("data", (data: Buffer) => {
      errorOutput += data.toString();
    });

    ffprobe.on("close", (code: number) => {
      if (code !== 0) {
        console.warn("[ffprobe] Failed:", errorOutput.trim());
        return resolve(null);
      }

      const duration = parseFloat(output.trim());
      resolve(isNaN(duration) ? null : duration);
    });

    ffprobe.on("error", () => resolve(null));
  });
}

/**
 * Generate WebP thumbnail using smart timing
 */
export async function generateVideoThumbnail(filePath: string): Promise<string> {
  const duration = await getVideoDuration(filePath);

  const ss =
    !duration || duration <= 0 ? 1.0 : duration < 2 ? 0.1 : 1.0;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "magicreel-thumb-"));
  const outPath = path.join(tmpDir, `thumb-${Date.now()}.webp`);

  const args = [
    "-y",
    "-ss",
    ss.toString(),
    "-i",
    filePath,
    "-vframes",
    "1",
    "-vf",
    "scale=480:-1",
    "-vcodec",
    "libwebp",
    outPath,
  ];

  await new Promise<void>((resolve, reject) => {
    const ffmpeg: ChildProcessWithoutNullStreams = spawn("ffmpeg", args);

    ffmpeg.on("close", (code: number) => {
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg exited with code ${code}`));
    });

    ffmpeg.on("error", (err: Error) => reject(err));
  });

  return outPath;
}
