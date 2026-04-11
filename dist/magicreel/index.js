"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("../auth/auth.routes"));
/* ----------------------------------
   🚨 CRITICAL BOOT CHECK (DO NOT REMOVE)
---------------------------------- */
console.log("BOOT ENV CHECK", {
    PORT: process.env.PORT,
    PROMPT_ONLY: process.env.PROMPT_ONLY,
});
/* ----------------------------------
   APP INIT
---------------------------------- */
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: "https://magicreel-frontend.vercel.app",
    credentials: true,
}));
// ✅ Required for large payloads (images)
app.use(express_1.default.json({ limit: "20mb" }));
/* ----------------------------------
   🚨 HEALTHCHECK (IMMUTABLE - DO NOT TOUCH)
---------------------------------- */
app.get("/", (_req, res) => {
    res.send("MagicReel backend running ✅");
});
app.get("/health", (_req, res) => {
    res.status(200).send("OK");
});
/* ----------------------------------
   ROUTES (SAFE ONLY)
---------------------------------- */
// ✅ Only auth route (no Redis risk)
app.use("/api/auth", auth_routes_1.default);
/* ----------------------------------
   🚨 SERVER START (IMMUTABLE)
---------------------------------- */
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🟢 MagicReel HTTP server listening on ${PORT}`);
});
/* ----------------------------------
   KEEP ALIVE
---------------------------------- */
setInterval(() => {
    console.log("🔄 keep alive");
}, 1000 * 30);
/* ----------------------------------
   PROCESS SAFETY
---------------------------------- */
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
});
