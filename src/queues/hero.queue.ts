import { Queue } from "bullmq";
import redis from "../config/redisConnection";

export const heroQueue = new Queue("hero-generation", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // retry 3 times
    backoff: {
      type: "exponential",
      delay: 5000, // 5 sec delay between retries
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});