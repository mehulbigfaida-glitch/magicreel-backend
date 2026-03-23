// src/queues/lookbookWorker.ts

import Queue from "bull";
import path from "path";

const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379") as string;

export const initLookbookWorkers = () => {
  console.log("📘 Initializing Lookbook Workers (Bull v3)...");

  const lookbookImageQueue = new Queue("lookbook-image-queue", REDIS_URL);
  lookbookImageQueue.process(
    path.join(__dirname, "../lookbook/services/editorial/lookbookOrchestrator.ts")
  );

  const lookbookPdfQueue = new Queue("lookbook-pdf-queue", REDIS_URL);
  lookbookPdfQueue.process(
    path.join(__dirname, "../lookbook/services/lookbookPdfService.ts")
  );

  const lookbookVideoQueue = new Queue("lookbook-video-queue", REDIS_URL);
  lookbookVideoQueue.process(
    path.join(__dirname, "../lookbook/services/lookbookVideoService.ts")
  );

  console.log("📗 Lookbook Workers Ready (Bull v3).");
};
