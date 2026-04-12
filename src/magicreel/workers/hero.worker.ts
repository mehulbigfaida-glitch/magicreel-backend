import { Worker } from "bullmq";
import redis from "../../lib/redis";
import { prisma } from "../db/prisma";
import { FashnService } from "../services/fashn.service";

// ✅ Init service
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

    console.log("🔥 Processing hero job:", jobId);

    try {
  console.log("📦 Worker received hero job (no processing):", jobId);

  // 🔒 DO NOT process Hero in worker
  await prisma.productToModelJob.update({
    where: { id: jobId },
    data: {
      status: "queued",
    },
  });

      console.log("✅ Hero job completed:", jobId);

    } catch (error: any) {
      console.error("❌ Hero job failed:", jobId, error.message);

      // ❗ Mark failed (retry handled by queue)
      await prisma.productToModelJob.update({
        where: { id: jobId },
        data: {
          status: "failed",
        },
      });

      throw error; // IMPORTANT → enables retry
    }
  },
  {
    connection: redis,

    // 🔥 CONCURRENCY CONTROL
    concurrency: 2,

    // 🔥 RATE LIMITER (ANTI-429 CORE)
    limiter: {
      max: 4,        // max 4 jobs
      duration: 1000 // per second
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

// 🔥 KEEP PROCESS ALIVE (Railway safe)
setInterval(() => {
  console.log("🔄 worker heartbeat");
}, 10000);