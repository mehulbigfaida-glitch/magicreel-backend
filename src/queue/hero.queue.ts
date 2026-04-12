import { Queue } from "bullmq";
import { redis } from "./redis";

export const heroQueue = new Queue("hero-queue", {
  connection: redis,
});