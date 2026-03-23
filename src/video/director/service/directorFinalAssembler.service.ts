// src/video/director/service/directorFinalAssembler.service.ts

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import ffmpegConfig from "../../../utils/ffmpegPath";

export interface DirectorFinalAssemblePayload {
  jobId: string;
  sceneOutputsPath: string;
  finalAudioPath: string;
}

export interface DirectorFinalAssembleResult {
  jobId: string;
  finalVideoPath: string;
}

const STORAGE_DIR = path.join(process.cwd(), "storage", "director_video");

const ensureDir = async (dir: string) => {
  await fs.promises.mkdir(dir, { recursive: true });
};

const runCommand = (cmd: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, _stdout, stderr) => {
      if (err) {
        console.error("FFMPEG ERROR:", stderr);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const processFinalAssembleJob = async (
  payload: DirectorFinalAssemblePayload
): Promise<DirectorFinalAssembleResult> => {
  const { jobId, sceneOutputsPath, finalAudioPath } = payload;

  // ✅ FIX: ffmpegPath is a value, not a function
  const ffmpeg = ffmpegConfig.ffmpegPath;

  const jobFolder = path.join(STORAGE_DIR, jobId);
  await ensureDir(jobFolder);

  const raw = await fs.promises.readFile(sceneOutputsPath, "utf8");
  const scenes = JSON.parse(raw);

  const concatList = path.join(jobFolder, "scene_list.txt");

  const listContent = scenes
    .map((s: any) => `file '${s.videoPath.replace(/'/g, "'\\''")}'`)
    .join("\n");

  await fs.promises.writeFile(concatList, listContent, "utf8");

  const mergedScenes = path.join(jobFolder, "final_scenes.mp4");
  const finalOutput = path.join(jobFolder, "director_output.mp4");

  const cmdMergeScenes =
    `"${ffmpeg}" -y -f concat -safe 0 -i "${concatList}" -c copy "${mergedScenes}"`;

  await runCommand(cmdMergeScenes);

  const cmdOverlayAudio =
    `"${ffmpeg}" -y -i "${mergedScenes}" -i "${finalAudioPath}" ` +
    `-c:v copy -map 0:v:0 -map 1:a:0 -shortest "${finalOutput}"`;

  await runCommand(cmdOverlayAudio);

  return {
    jobId,
    finalVideoPath: finalOutput,
  };
};
