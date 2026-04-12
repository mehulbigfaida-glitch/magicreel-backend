import { Queue } from "bullmq";
import redis from "../../config/redisConnection";

export const heroQueue = new Queue("hero-generation", {
  connection: redis as any,
});