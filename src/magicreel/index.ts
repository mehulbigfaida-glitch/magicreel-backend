import "../lib/redis";
import "dotenv/config";

import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import { authenticate } from "../auth/jwt.middleware";
import p2mRoutes from "./p2m/p2m.routes";

/* ----------------------------------
   BOOT CHECK
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

// 🔥 ADD THIS BACK (CRITICAL)
app.use(express.json({ limit: "20mb" }));

/* ----------------------------------
   ROOT + HEALTH (CRITICAL)
---------------------------------- */

app.get("/", (_req, res) => {
  res.send("MagicReel backend running ✅");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* ----------------------------------
   PUBLIC ROUTES
---------------------------------- */

app.use("/api/auth", authRoutes);

/* ----------------------------------
   CORE ROUTES
---------------------------------- */

app.use("/api/predictions", predictionsRoutes);
app.use("/api/p2m", authenticate, p2mRoutes);

/* ----------------------------------
   START SERVER (FINAL FIX)
---------------------------------- */

const PORT = Number(process.env.PORT) || 8080;

// Connect Prisma (non-blocking)
prisma.$connect()
  .then(() => {
    console.log("✅ Prisma connected");
  })
  .catch((err) => {
    console.error("❌ Prisma failed:", err);
  });

// Start server immediately
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 MagicReel HTTP server listening on ${PORT}`);
});

/* ----------------------------------
   KEEP PROCESS ALIVE (CRITICAL)
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