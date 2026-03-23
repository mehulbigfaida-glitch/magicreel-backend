import "dotenv/config";
import { Worker } from "bullmq";
import { FashnService } from "../services/fashn.service";

console.log("🟢 Hero Worker running and waiting for jobs...");

const fashn = new FashnService();

const worker = new Worker(
  "heroQueue",
  async job => {
    const {
      prompt,
      modelImageUrl,
      garmentImageUrl,
      jobData
    } = job.data;

    console.log("Processing hero job:", job.id);

    await fashn.runProductToModel({
      ...jobData,
      prompt,
      modelImageUrl,
      garmentImageUrl
    });

  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  }
);

worker.on("completed", job => {
  console.log("Hero job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Hero job failed:", job?.id, err);
});