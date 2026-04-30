let heroQueue: any = null;

if (process.env.ENABLE_QUEUE === "true") {
  const { Queue } = require("bullmq");
  const Redis = require("ioredis");

  const redis = new Redis(process.env.REDIS_URL);

  heroQueue = new Queue("hero-generation", {
    connection: redis,
  });

  console.log("✅ Queue enabled");
} else {
  console.warn("⚠️ Queue disabled (Redis bypassed)");
}

export { heroQueue };