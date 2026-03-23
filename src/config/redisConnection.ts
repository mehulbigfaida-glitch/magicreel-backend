import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("connect", () => {
  console.log("✅ Redis connected on 127.0.0.1:6379");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;
export { redis };
