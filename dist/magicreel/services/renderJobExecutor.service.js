"use strict";
// src/magicreel/services/renderJobExecutor.service.ts
// 🔒 RenderJob Executor — v1.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeRenderJob = void 0;
const fashn_service_1 = require("./fashn.service");
/**
 * Executes a single RenderJob end-to-end
 * - pending → running → completed / failed
 * - No retries loop (v1.0)
 * - No prompt mutation
 */
const executeRenderJob = async (job) => {
    const fashn = new fashn_service_1.FashnService();
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
    }
    catch (err) {
        job.status = "failed";
        job.failureReason = err?.message || "Execution error";
        job.updatedAt = new Date().toISOString();
        return job;
    }
};
exports.executeRenderJob = executeRenderJob;
/* ---------------------------------------------------------
   Utilities
--------------------------------------------------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
