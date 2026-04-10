import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL as string;

// ✅ Detect if TLS needed
const isTLS = redisUrl.startsWith("rediss://");

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  ...(isTLS ? { tls: { rejectUnauthorized: false } } : {}), // 🔥 FIX
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