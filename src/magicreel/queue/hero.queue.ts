import { Queue } from "bullmq";

export const heroQueue = new Queue("heroQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },

  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});