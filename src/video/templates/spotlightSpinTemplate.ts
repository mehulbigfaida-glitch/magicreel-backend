import { spawn } from "child_process";
import {
  VideoTemplateDefinition,
  TemplateRenderParams,
} from "./VideoTemplate";

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);

    ffmpeg.stdout.on("data", (data) => {
      console.log("[FFmpeg STDOUT]", data.toString());
    });

    ffmpeg.stderr.on("data", (data) => {
      console.log("[FFmpeg STDERR]", data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

export const spotlightSpinTemplate: VideoTemplateDefinition = {
  id: "spotlight_spin",
  label: "Spotlight Spin Scene",
  description: "Subtle rotate + vignette, like a spotlight on the model.",

  async render(params: TemplateRenderParams): Promise<void> {
    const { imagePath, outputPath, options } = params;

    const durationSeconds = options?.durationSeconds ?? 7;
    const fps = 25;
    const width = 854;
    const height = 480;

    const filterComplex = [
      `[0:v]scale=${width}:${height},`,
      `rotate=0.005*t:c=black,`,
      `vignette=PI/4:0.6,`,
      `format=yuv420p[v]`,
    ].join("");

    const args = [
      "-y",
      "-loop",
      "1",
      "-i",
      imagePath,
      "-t",
      String(durationSeconds),
      "-filter_complex",
      filterComplex,
      "-map",
      "[v]",
      "-r",
      String(fps),
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-movflags",
      "+faststart",
      outputPath,
    ];

    console.log("[SpotlightSpinTemplate] ffmpeg args:", args);
    await runFfmpeg(args);
    console.log("[SpotlightSpinTemplate] Completed:", outputPath);
  },
};
