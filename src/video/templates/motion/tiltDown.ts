import { VideoTemplateDefinition } from "../VideoTemplate";
import { spawn } from "child_process";

export const tiltDownTemplate: VideoTemplateDefinition = {
  id: "tiltDown",
  label: "Tilt Down",
  description: "Vertical tilt downward.",

  async render({ imagePath, outputPath, options }) {
    const duration = options?.durationSeconds ?? 5;
    const fps = 24;
    const totalFrames = duration * fps;

    const vf =
      "scale=720:1280:force_original_aspect_ratio=increase," +
      `zoompan=z='1':x='(iw-ow)/2':y='ih*(on/${totalFrames})':d=1:fps=${fps},` +
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

      ff.stderr.on("data", d => console.log("[tiltDown]", d.toString()));
      ff.on("close", code => (code === 0 ? resolve() : reject(new Error("tiltDown failed"))));
    });
  },
};
