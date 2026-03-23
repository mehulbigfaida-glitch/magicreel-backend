// src/video/queues/directorFinalAssembleQueue.ts

import Queue from "bull";

const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379") as string;

export interface DirectorFinalAssembleJobData {
  jobId: string;
  scenesPath: string;
  audioPath: string;
}

export const directorFinalAssembleQueue = new Queue<DirectorFinalAssembleJobData>(
  "director-final-queue",
  REDIS_URL
);
