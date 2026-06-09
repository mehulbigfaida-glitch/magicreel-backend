// src/magicreel/services/carouselKenBurnsV2.service.ts

import fs from "fs";
import path from "path";
import https from "https";
import { spawn } from "child_process";

import { ffmpegPath } from "../../utils/ffmpegPath";
import { magicReelConcatService } from "../../video/services/magicReelConcat.service";

function downloadFile(
  url: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        try {
          fs.unlinkSync(outputPath);
        } catch {}

        reject(err);
      });
  });
}

export const carouselKenBurnsV2Service = {
  async generate({
    imageUrls,
  }: {
    imageUrls: string[];
  }) {
    if (!imageUrls?.length) {
      throw new Error("imageUrls required");
    }

    const tempDir = path.join(
      process.cwd(),
      "storage",
      "carousel-reel-v2",
      Date.now().toString()
    );

    fs.mkdirSync(tempDir, {
      recursive: true,
    });

    const clipPaths: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];

      const imagePath = path.join(
        tempDir,
        `image-${i + 1}.jpg`
      );

      const clipPath = path.join(
        tempDir,
        `clip-${i + 1}.mp4`
      );

      console.log(
        `⬇️ Downloading image ${i + 1}/${imageUrls.length}`
      );

      await downloadFile(
        imageUrl,
        imagePath
      );

      const totalFrames = 75;

      let zoomPan = "";

      zoomPan =
  `zoompan=` +
  `z='1.0':` +
  `d=${totalFrames}:` +
  `x='0':` +
  `y='0':` +
  `s=1080x1920`;

      const filter = [
        "scale=1080:1920:force_original_aspect_ratio=decrease",
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black",
        zoomPan,
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
        "2.5",
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
        clipPath,
      ];

      console.log(
        `🎬 Creating clip ${i + 1}/${imageUrls.length}`
      );

      await new Promise<void>((resolve, reject) => {
        const ff = spawn(
          ffmpegPath,
          args
        );

        ff.stderr.on("data", (d) => {
          console.log(
            `[clip-${i + 1}]`,
            d.toString()
          );
        });

        ff.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(
              new Error(
                `Clip generation failed: ${code}`
              )
            );
          }
        });

        ff.on("error", reject);
      });

      clipPaths.push(clipPath);
    }

    console.log("🎞️ Concatenating clips...");

    const finalVideoPath =
      await magicReelConcatService.generateMagicReel({
        clips: clipPaths,
        outputDir: tempDir,
      });

    return {
      finalVideoPath,
      tempDir,
    };
  },
};