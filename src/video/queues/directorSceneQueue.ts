// src/video/queues/directorSceneQueue.ts

import Queue from "bull";

const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379") as string;

export interface DirectorSceneJobData {
  jobId: string;
  timelinePath: string;
  audioDurationMs: number;
}

export const directorSceneQueue = new Queue<DirectorSceneJobData>(
  "director-scene-queue",
  REDIS_URL
);
