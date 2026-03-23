// src/video/templates/motion/parallaxHorizontal.ts

import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";
import { easingExpr, EasingType } from "./easing";

export const parallaxHorizontalTemplate: VideoTemplateDefinition = {
  id: "parallaxHorizontal",
  label: "Parallax Horizontal",
  description: "Smooth horizontal parallax drift left → right.",

  async render({ imagePath, outputPath, options }) {

    const easingOption = options?.easing;
    const duration = options?.durationSeconds ?? 5;
    const easing = (options?.easing ?? "linear") as EasingType;
    const motionSpeed = options?.motionSpeed ?? 1;

    const fps = 24;
    const width = 720;
    const height = 1280;

    const E = easingExpr(easing, duration, motionSpeed);

    const maxShift = 0.03;

    const vf =
      `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
      `crop=${width}:${height}:` +
      `x='(iw-ow)/2 + (${maxShift}*iw)*(${E})':` +
      `y='(ih-oh)/2',` +
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
        console.log("[parallaxHorizontal]", d.toString())
      );

      ff.on("close", (code) =>
        code === 0
          ? resolve()
          : reject(new Error("parallaxHorizontal failed"))
      );
    });
  },
};