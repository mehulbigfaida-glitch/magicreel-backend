// src/video/templates/motion/rotateLeft.ts

import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";
import { easingExpr, EasingType } from "./easing";

export const rotateLeftTemplate: VideoTemplateDefinition = {
  id: "rotateLeft",
  label: "Rotate Left",
  description: "Gentle leftward rotation (counter-clockwise).",

  async render({ imagePath, outputPath, options }) {
    const duration = options?.durationSeconds ?? 5;
    const easing: EasingType = options?.easing ?? "linear";
    const motionSpeed = options?.motionSpeed ?? 1;

    const fps = 24;
    const width = 720;
    const height = 1280;

    const E = easingExpr(easing, duration, motionSpeed);

    // Rotation angle: 0° → -5°
    const vf =
      `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
      `rotate='(-5*PI/180)*(${E})':ow=${width}:oh=${height},` +
      `crop=${width}:${height}:x='(iw-ow)/2':y='(ih-oh)/2',` +
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
      ff.stderr.on("data", (d) => console.log("[rotateLeft]", d.toString()));
      ff.on("close", (code) =>
        code === 0 ? resolve() : reject(new Error("rotateLeft failed"))
      );
    });
  },
};
