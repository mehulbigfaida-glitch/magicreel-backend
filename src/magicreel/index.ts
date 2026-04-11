import "dotenv/config";

import express from "express";
import cors from "cors";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import { authenticate } from "../auth/jwt.middleware";
import p2mRoutes from "./p2m/p2m.routes";

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

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://magicreel-frontend.vercel.app",
    credentials: true,
  })
);

// ✅ Required for large payloads (images)
app.use(express.json({ limit: "20mb" }));

/* ----------------------------------
   🚨 HEALTHCHECK (IMMUTABLE - DO NOT TOUCH)
---------------------------------- */

// Root
app.get("/", (_req, res) => {
  res.send("MagicReel backend running ✅");
});

// 🔒 Railway healthcheck (must be FAST + TEXT)
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

/* ----------------------------------
   ROUTES
---------------------------------- */

// Public
app.use("/api/auth", authRoutes);

// Protected
app.use("/api/predictions", predictionsRoutes);
app.use("/api/p2m", authenticate, p2mRoutes);

/* ----------------------------------
   🚨 SERVER START (IMMUTABLE)
---------------------------------- */

const PORT = Number(process.env.PORT) || 8080;

// 🔒 Start server IMMEDIATELY (no blocking before this)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 MagicReel HTTP server listening on ${PORT}`);
});

/* ----------------------------------
   KEEP ALIVE (SAFE)
---------------------------------- */

setInterval(() => {
  console.log("🔄 keep alive");
}, 1000 * 30);

/* ----------------------------------
   PROCESS SAFETY
---------------------------------- */

process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
});