import { Queue } from "bullmq";
import Redis from "ioredis";

// ✅ Use Railway Redis URL
const connection = new Redis(process.env.REDIS_URL as string);

export const heroQueue = new Queue("hero-generation", {
  connection,

  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});