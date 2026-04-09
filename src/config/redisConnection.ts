import Redis from "ioredis";

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  // ✅ Production (Railway Redis)
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected (production)");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });
} else {
  // ✅ Fallback (NO REDIS — prevents crash)
  console.warn("⚠️ Redis disabled (no REDIS_URL provided)");
}

export default redis;
export { redis };