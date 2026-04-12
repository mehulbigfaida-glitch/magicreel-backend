import { Worker } from "bullmq";
import Redis from "ioredis";
import { prisma } from "../db/prisma";
import { FashnService } from "../services/fashn.service";

// ✅ FIXED REDIS CONFIG (CRITICAL)
const connection = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// ✅ Init service (kept for future use)
const fashn = new FashnService();

console.log("🟢 Hero Worker running and waiting for jobs...");

const worker = new Worker(
  "hero-generation",
  async (job) => {
    const {
      jobId,
      prompt,
      modelImageUrl,
      garmentImageUrl,
      pose,
      engine,
    } = job.data;

    console.log("📦 Worker received hero job:", jobId);
    console.log("🔥 Processing hero job:", jobId);

    try {
      // ✅ Check if job exists
      const existing = await prisma.productToModelJob.findUnique({
        where: { id: jobId },
      });

      if (!existing) {
        console.log("⚠️ Job not found in DB, skipping update:", jobId);
        return;
      }

      // ✅ Safe update
      await prisma.productToModelJob.update({
        where: { id: jobId },
        data: {
          status: "queued",
        },
      });

      console.log("✅ Hero job marked as queued:", jobId);

    } catch (error: any) {
      console.error("❌ Hero job failed:", jobId, error.message);

      try {
        const existing = await prisma.productToModelJob.findUnique({
          where: { id: jobId },
        });

        if (existing) {
          await prisma.productToModelJob.update({
            where: { id: jobId },
            data: {
              status: "failed",
            },
          });
        } else {
          console.log("⚠️ Skip fail update — job not found:", jobId);
        }
      } catch (err: any) {
        console.error("❌ Failed to mark job as failed:", err.message);
      }

      throw error; // keep retry logic
    }
  },
  {
    connection,
    concurrency: 2,
    limiter: {
      max: 4,
      duration: 1000,
    },
  }
);

// ✅ SUCCESS LOG
worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

// ❌ FAILURE LOG
worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err.message);
});

console.log("🚀 Hero Worker started");

// 🔥 KEEP PROCESS ALIVE
setInterval(() => {
  console.log("🔄 worker heartbeat");
}, 10000);