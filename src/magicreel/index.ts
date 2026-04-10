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

// JSON body
app.use(express.json({ limit: "20mb" }));

/* ----------------------------------
   ROOT + HEALTH
---------------------------------- */

app.get("/", (_req, res) => {
  res.send("MagicReel backend running ✅");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Railway healthcheck
app.get("/ping", (_req, res) => {
  res.send("pong");
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
   START SERVER (RAILWAY SAFE)
---------------------------------- */

const PORT = process.env.PORT || "8080";

// Start server FIRST (critical)
app.listen(Number(PORT), "0.0.0.0", async () => {
  console.log(`🟢 MagicReel HTTP server listening on ${PORT}`);
  console.log("🌐 Server fully initialized and ready");

  // 🔥 INIT REDIS AFTER SERVER START
  try {
    await import("../lib/redis.js");
    console.log("✅ Redis initialized");
  } catch (err) {
    console.error("❌ Redis init failed:", err);
  }

  // 🔥 Connect Prisma AFTER server start
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");
  } catch (err) {
    console.error("❌ Prisma failed:", err);
  }
});

/* ----------------------------------
   PROCESS SAFETY
---------------------------------- */

process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
});