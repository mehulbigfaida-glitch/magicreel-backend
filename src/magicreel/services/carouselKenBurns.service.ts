import { spawn } from "child_process";
import { ffmpegPath } from "../../utils/ffmpegPath";

export const carouselKenBurnsService = {
  async generateClip({
    imagePath,
    outputVideoPath,
    durationSeconds = 2,
    fps = 30,
  }: {
    imagePath: string;
    outputVideoPath: string;
    durationSeconds?: number;
    fps?: number;
  }) {
    const totalFrames = durationSeconds * fps;

    const filter = [
      // Preserve aspect ratio and fill portrait frame
      "scale=1080:1920:force_original_aspect_ratio=increase",

      // Remove overflow
      "crop=1080:1920",

      // Smooth luxury zoom
      `zoompan=` +
        `z='min(zoom+0.002,1.12)':` +
        `d=${totalFrames}:` +
        `x='iw/2-(iw/zoom/2)':` +
        `y='ih/2-(ih/zoom/2)':` +
        `s=1080x1920`,

      "fps=30",
      "format=yuv420p",
    ].join(",");

    const args = [
      "-y",

      "-loop",
      "1",

      "-i",
      imagePath,

      "-t",
      `${durationSeconds}`,

      "-vf",
      filter,

      "-c:v",
      "libx264",

      "-preset",
      "medium",

      "-pix_fmt",
      "yuv420p",

      "-movflags",
      "+faststart",

      outputVideoPath,
    ];

    console.log("🎬 Ken Burns FFmpeg");
    console.log(args.join(" "));

    await new Promise<void>((resolve, reject) => {
      const ff = spawn(ffmpegPath, args);

      ff.stdout.on("data", (d) => {
        console.log("[kenburns-out]", d.toString());
      });

      ff.stderr.on("data", (d) => {
        console.log("[kenburns]", d.toString());
      });

      ff.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `Ken Burns FFmpeg exited with code ${code}`
            )
          );
        }
      });

      ff.on("error", reject);
    });

    return outputVideoPath;
  },
};