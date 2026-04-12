import { Queue } from "bullmq";
import redis from "../lib/redis";

export const heroQueue = new Queue("hero-generation", {
  connection: redis,
});