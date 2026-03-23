import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";

export const shakeTemplate: VideoTemplateDefinition = {
  id: "shake",
  label: "Shake",
  description: "Handheld camera shake effect.",

  async render({ imagePath, outputPath, options }) {
    const duration = options?.durationSeconds ?? 5;
    const fps = 24;

    const width = 720;
    const height = 1280;

    const vf =
      `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
      `rotate='(1*PI/180)*sin(2*PI*t*1.3)':ow=${width}:oh=${height}:fillcolor=black,` +
      `crop=${width}:${height}:x='(iw-ow)/2 + 5*sin(2*PI*t*3)':` +
      `y='(ih-oh)/2 + 5*cos(2*PI*t*2.2)',format=yuv420p`;

    const args = ["-y","-loop","1","-i",imagePath,"-t",String(duration),"-vf",vf,"-r",String(fps),outputPath];

    await new Promise<void>((resolve, reject) => {
      const ff = spawn("ffmpeg", args);
      ff.stderr.on("data", d => console.log("[shake]", d.toString()));
      ff.on("close", c => c === 0 ? resolve() : reject(new Error("shake failed")));
    });
  },
};
