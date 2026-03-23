// src/magicreel/services/renderJobExecutor.service.ts
// 🔒 RenderJob Executor — v1.0

import { RenderJob } from "../schema/lookbook.schema";
import { FashnService } from "./fashn.service";

/**
 * Executes a single RenderJob end-to-end
 * - pending → running → completed / failed
 * - No retries loop (v1.0)
 * - No prompt mutation
 */
export const executeRenderJob = async (
  job: RenderJob
): Promise<RenderJob> => {
  const fashn = new FashnService();

  try {
    // 1️⃣ Mark running
    job.status = "running";
    job.updatedAt = new Date().toISOString();

    // 2️⃣ Execute via FASHN
    const runId = await fashn.runProductToModel(job);

    // 3️⃣ Poll status (blocking)
    while (true) {
      await sleep(3000);

      const statusRes = await fashn.pollStatus(runId);

      if (statusRes.status === "completed") {
        job.status = "completed";
        job.outputImageUrl = statusRes.output?.[0];
        job.updatedAt = new Date().toISOString();
        return job;
      }

      if (statusRes.status === "failed") {
        job.status = "failed";
        job.failureReason = statusRes.error || "FASHN job failed";
        job.updatedAt = new Date().toISOString();
        return job;
      }
    }
  } catch (err: any) {
    job.status = "failed";
    job.failureReason = err?.message || "Execution error";
    job.updatedAt = new Date().toISOString();
    return job;
  }
};

/* ---------------------------------------------------------
   Utilities
--------------------------------------------------------- */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
