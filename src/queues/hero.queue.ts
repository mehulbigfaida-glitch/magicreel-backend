let heroQueue: any = null;

if (process.env.ENABLE_QUEUE === "true") {
  const { Queue } = require("bullmq");
  const redis = require("../config/redisConnection").default;

  heroQueue = new Queue("hero-generation", {
    connection: redis,
  });

  console.log("✅ Hero queue enabled");
} else {
  console.warn("⚠️ Hero queue disabled (local dev)");
}

export { heroQueue };