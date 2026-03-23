// src/video/utils/basicMotionEngine.ts

import { spawn } from "child_process";

export type BasicMotionType =
  | "zoomIn"
  | "zoomOut"
  | "panLeft"
  | "panRight"
  | "tiltUp"
  | "tiltDown"
  | "rotateLeft"
  | "rotateRight"
  | "driftLeft"
  | "driftRight"
  | "slideDiagonalUp"
  | "slideDiagonalDown";

export interface BasicMotionOptions {
  imagePath: string;
  outputPath: string;
  motion: BasicMotionType;
  durationSeconds: number;
  fps: number;
  width?: number;
  height?: number;
}

// Build filter expression for each motion
function buildBasicFilter(opts: BasicMotionOptions): string {
  const width = opts.width ?? 854;
  const height = opts.height ?? 480;
  const { motion, fps, durationSeconds } = opts;

  const totalFrames = fps * durationSeconds;

  // Fit image into canvas without distortion
  const baseFit =
    `scale='min(${width}/iw,${height}/ih)*iw':'min(${width}/iw,${height}/ih)*ih',` +
    `pad=${width}:${height}:((${width}-iw)/2):(${height}-ih)/2`;

  //
  // === MOTION FILTERS ===
  //
  switch (motion) {
    // ----------------------
    // ZOOM
    // ----------------------
    case "zoomIn":
      return `${baseFit},zoompan=z='min(zoom+0.002,1.3)':d=1:s=${width}x${height}:fps=${fps}`;

    case "zoomOut":
      return `${baseFit},zoompan=z='1.3-0.002*on':d=1:s=${width}x${height}:fps=${fps}`;

    // ----------------------
    // PAN
    // ----------------------
    case "panLeft":
      return `${baseFit},zoompan=z=1.1:x='iw*(1-on/${totalFrames})':y=0:d=1:s=${width}x${height}:fps=${fps}`;

    case "panRight":
      return `${baseFit},zoompan=z=1.1:x='iw*(on/${totalFrames})':y=0:d=1:s=${width}x${height}:fps=${fps}`;

    // ----------------------
    // TILT
    // ----------------------
    case "tiltUp":
      return `${baseFit},zoompan=z=1.1:x=0:y='ih*(1-on/${totalFrames})':d=1:s=${width}x${height}:fps=${fps}`;

    case "tiltDown":
      return `${baseFit},zoompan=z=1.1:x=0:y='ih*(on/${totalFrames})':d=1:s=${width}x${height}:fps=${fps}`;

    // ----------------------
    // ROTATE (must use time 't')
    // ----------------------
    case "rotateLeft":
      return `${baseFit},rotate='-(PI/180)*t':ow=${width}:oh=${height}`;

    case "rotateRight":
      return `${baseFit},rotate='(PI/180)*t':ow=${width}:oh=${height}`;

    // ----------------------
    // DRIFT (slow pans)
    // ----------------------
    case "driftLeft":
      return `${baseFit},zoompan=z=1.05:x='iw*(0.2-on/${totalFrames}/5)':y=0:d=1:s=${width}x${height}:fps=${fps}`;

    case "driftRight":
      return `${baseFit},zoompan=z=1.05:x='iw*(on/${totalFrames}/5)':y=0:d=1:s=${width}x${height}:fps=${fps}`;

    // ----------------------
    // DIAGONAL SLIDES
    // ----------------------
    case "slideDiagonalUp":
      return `${baseFit},zoompan=z=1.1:x='iw*(on/${totalFrames})':y='ih*(1-on/${totalFrames})':d=1:s=${width}x${height}:fps=${fps}`;

    case "slideDiagonalDown":
      return `${baseFit},zoompan=z=1.1:x='iw*(1-on/${totalFrames})':y='ih*(on/${totalFrames})':d=1:s=${width}x${height}:fps=${fps}`;

    // ----------------------
    // DEFAULT
    // ----------------------
    default:
      return baseFit;
  }
}

function buildArgs(opts: BasicMotionOptions): string[] {
  const { imagePath, outputPath, durationSeconds } = opts;
  const filter = buildBasicFilter(opts);

  return [
    "-y",
    "-loop", "1",
    "-i", imagePath,
    "-t", durationSeconds.toString(),
    "-an",
    "-vf", filter,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    outputPath
  ];
}

// FFmpeg runner
export function generateBasicMotion(opts: BasicMotionOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = buildArgs(opts);

    console.log("[basicMotionEngine] ffmpeg args:", args.join(" "));

    const ff = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });

    ff.stdout.on("data", d => console.log("[ffmpeg-out]", d.toString()));
    ff.stderr.on("data", d => console.log("[ffmpeg-err]", d.toString()));

    ff.on("error", reject);

    ff.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}
