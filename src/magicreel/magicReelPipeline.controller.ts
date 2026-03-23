import { Request, Response } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { runMagicReelJob } from "./magicReelPipeline.service";

type JobStatus = "queued" | "running" | "completed" | "failed";

interface JobRecord {
  status: JobStatus;
  result?: any;
  error?: string;
}

const jobs = new Map<string, JobRecord>();

export async function generateMagicReelController(
  req: Request,
  res: Response
) {
  const { heroImagePath } = req.body;

  if (!heroImagePath) {
    return res.status(400).json({ error: "heroImagePath required" });
  }

  const jobId = uuidv4();

  jobs.set(jobId, { status: "queued" });

  res.json({ status: "accepted", jobId });

  const outputDir = path.join(
    process.cwd(),
    "src",
    "magicreel",
    "outputs",
    Date.now().toString()
  );

  (async () => {
    try {
      jobs.set(jobId, { status: "running" });

      const result = await runMagicReelJob(heroImagePath, outputDir);

      jobs.set(jobId, {
        status: "completed",
        result,
      });

      console.log("======================================");
      console.log("✅ MAGICREEL COMPLETED SUCCESSFULLY");
      console.log("🎬 Video path:", result.videoPath);
      console.log("🌍 Video URL:", result.videoUrl);
      console.log("======================================");
    } catch (err: any) {
      jobs.set(jobId, {
        status: "failed",
        error: err.message,
      });
      console.error("❌ MAGICREEL FAILED:", err.message);
    }
  })();
}

export function magicReelStatusController(req: Request, res: Response) {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
}
