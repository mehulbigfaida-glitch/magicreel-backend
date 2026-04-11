"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redis = null;
exports.redis = redis;
if (process.env.REDIS_URL) {
    // ✅ Production (Railway Redis)
    exports.redis = redis = new ioredis_1.default(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });
    redis.on("connect", () => {
        console.log("✅ Redis connected (production)");
    });
    redis.on("error", (err) => {
        console.error("❌ Redis error:", err.message);
    });
}
else {
    // ✅ Fallback (NO REDIS — prevents crash)
    console.warn("⚠️ Redis disabled (no REDIS_URL provided)");
}
exports.default = redis;
