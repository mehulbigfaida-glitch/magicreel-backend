// src/video/queues/directorAudioQueue.ts
import Queue from "bull";

const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379") as string;

export interface DirectorAudioJobData {
  script: string;
  voiceId?: string;
  speed?: number;
  language?: string;
  metadata?: any;
}

export const directorAudioQueue = new Queue<DirectorAudioJobData>(
  "director-audio-queue",
  REDIS_URL
);
