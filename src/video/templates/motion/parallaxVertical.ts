// src/video/templates/motion/parallaxVertical.ts

import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";
import { easingExpr, EasingType } from "./easing";

export const parallaxVerticalTemplate: VideoTemplateDefinition = {
  id: "parallaxVertical",
  label: "Parallax Vertical",
  description: "Smooth vertical parallax drift top → bottom.",

  async render({ imagePath, outputPath, options }) {
    const duration = options?.durationSeconds ?? 5;
    const easing: EasingType = options?.easing ?? "linear";
    const motionSpeed = options?.motionSpeed ?? 1;

    const fps = 24;
    const width = 720;
    const height = 1280;

    const E = easingExpr(easing, duration, motionSpeed);

    const maxShift = 0.03; // 3%

    const vf =
      `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
      `crop=${width}:${height}:` +
      `x='(iw-ow)/2':` +
      `y='(ih-oh)/2 + (${maxShift}*ih)*(${E})',` +
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
      ff.stderr.on("data", (d) =>
        console.log("[parallaxVertical]", d.toString())
      );
      ff.on("close", (code) =>
        code === 0 ? resolve() : reject(new Error("parallaxVertical failed"))
      );
    });
  },
};
