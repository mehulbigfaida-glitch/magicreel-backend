import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL as string;

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;