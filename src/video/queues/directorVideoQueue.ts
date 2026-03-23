// src/video/queues/directorVideoQueue.ts

import Queue from "bull";

const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379") as string;

export interface DirectorVideoJobData {
  jobId: string;
  videoPath: string;
}

export const directorVideoQueue = new Queue<DirectorVideoJobData>(
  "director-video-queue",
  REDIS_URL
);
