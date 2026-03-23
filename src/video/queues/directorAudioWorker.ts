// src/video/queues/directorAudioWorker.ts

import Queue from "bull";
import { directorAudioQueue } from "./directorAudioQueue";
import fs from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "storage", "director");

// Ensure folder exists
if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });

// ----------------------------
// WORKER PROCESSOR
// ----------------------------
directorAudioQueue.process(async (job) => {
  const { script } = job.data;

  const jobFolder = path.join(BASE_DIR, String(job.id));
  if (!fs.existsSync(jobFolder)) fs.mkdirSync(jobFolder, { recursive: true });

  // Fake 1-second processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const finalAudioPath = path.join(jobFolder, "final.mp3");
  const timelinePath = path.join(jobFolder, "timeline.json");

  // Stub audio (creates empty mp3 file)
  fs.writeFileSync(finalAudioPath, "");

  // Timeline JSON stub
  fs.writeFileSync(
    timelinePath,
    JSON.stringify({
      jobId: job.id,
      script,
      duration: 1,
      segments: [{ start: 0, end: 1 }],
    })
  );

  return {
    finalAudio: finalAudioPath,
    timeline: timelinePath,
  };
});

console.log("🎧 Director Audio Worker Ready");
