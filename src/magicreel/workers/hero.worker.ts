import { Worker } from "bullmq";
import redis from "../../lib/redis";
import { prisma } from "../db/prisma";
import { FashnService } from "../services/fashn.service";

// ✅ THIS LINE IS MANDATORY
const fashn = new FashnService();

console.log("🟢 Hero Worker running and waiting for jobs...");

const worker = new Worker(
  "hero-generation", // ✅ must match queue
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
      const runId = await fashn.runProductToModel({
        jobId,
        lookbookId: "hero",
        pose,
        engine,
        prompt,
        modelImageUrl,
        garmentImageUrl,
        status: "pending",
        retries: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // ✅ update DB
      await prisma.productToModelJob.update({
        where: { id: jobId },
        data: {
          engineJobId: runId,
          status: "completed",
        },
      });

      console.log("✅ Hero job completed:", jobId);

    } catch (error: any) {
      console.error("❌ Hero job failed:", jobId, error.message);

      await prisma.productToModelJob.update({
        where: { id: jobId },
        data: {
          status: "failed",
        },
      });

      throw error;
    }
  },
  {
    connection: redis, // ✅ use Railway Redis
    concurrency: 2, // 🔥 controls rate → prevents 429
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err.message);
});

console.log("🚀 Hero Worker started");