import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";

export const zoomOutTemplate: VideoTemplateDefinition = {
  id: "zoomOut",
  label: "Zoom Out",
  description: "Simple smooth zoom-out motion (stable original).",

  async render({ imagePath, outputPath, options }) {
    const duration = options?.durationSeconds ?? 5;
    const fps = 24;

    const vf =
      "scale=720:1280:force_original_aspect_ratio=increase," +
      "zoompan=z='1-0.10*t':d=1:x='(iw-ow)/2':y='(ih-oh)/2':fps=24," +
      "crop=720:1280,format=yuv420p";

    await new Promise<void>((resolve, reject) => {
      const ff = spawn("ffmpeg", [
        "-y",
        "-loop", "1",
        "-i", imagePath,
        "-t", `${duration}`,
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "fast",
        "-r", `${fps}`,
        outputPath,
      ]);

      ff.stderr.on("data", d => console.log("[zoomOut]", d.toString()));
      ff.on("close", code => (code === 0 ? resolve() : reject(new Error("zoomOut failed"))));
    });
  },
};
