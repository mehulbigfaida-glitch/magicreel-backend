// src/video/templates/motion/slideDiagonalDown.ts

import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";
import { easingExpr, EasingType } from "./easing";

export const slideDiagonalDownTemplate: VideoTemplateDefinition = {
  id: "slideDiagonalDown",
  label: "Slide Diagonal Down",
  description: "Smooth diagonal slide: top-left → bottom-right.",

  async render({ imagePath, outputPath, options }) {
    const duration = options?.durationSeconds ?? 5;
    const easing: EasingType = options?.easing ?? "linear";
    const motionSpeed = options?.motionSpeed ?? 1;

    const fps = 24;
    const width = 720;
    const height = 1280;

    const E = easingExpr(easing, duration, motionSpeed);

    const vf =
      `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
      `crop=${width}:${height}:` +
      `x='(iw-ow)*(${E})':` +
      `y='(ih-oh)*(${E})',` +
      `format=yuv420p`;

    const args = [
      "-y",
      "-loop",
      "1",
      "-i",
      imagePath,
      "-t",
      `${duration}`,
      "-vf",
      vf,
      "-r",
      `${fps}`,
      outputPath,
    ];

    await new Promise<void>((resolve, reject) => {
      const ff = spawn("ffmpeg", args);
      ff.stderr.on("data", (d) => console.log("[slideDiagonalDown]", d.toString()));
      ff.on("close", (code) =>
        code === 0 ? resolve() : reject(new Error("slideDiagonalDown failed"))
      );
    });
  },
};
