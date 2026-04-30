import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true,

  retryStrategy: (times) => {
    const delay = Math.min(times * 200, 2000);
    console.log(`🔄 Redis retry attempt: ${times}`);
    return delay;
  },

  reconnectOnError: (err) => {
    console.log("🔁 Reconnect on error:", err.message);
    return true;
  },

  keepAlive: 10000,
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