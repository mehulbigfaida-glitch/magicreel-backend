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

app.use(cors());
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
   START SERVER
---------------------------------- */

const PORT = Number(process.env.PORT) || 8080;

async function startServer() {
  try {
    // ✅ Ensure DB connection BEFORE server starts
    await prisma.$connect();
    console.log("✅ Prisma connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🟢 MagicReel HTTP server listening on ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); // crash properly if DB fails
  }
}

startServer();

/* ----------------------------------
   KEEP PROCESS ALIVE (CRITICAL FOR RAILWAY)
---------------------------------- */

// prevents Node from exiting
setInterval(() => {
  // keep-alive tick
}, 1000 * 60);

/* ----------------------------------
   PROCESS SAFETY
---------------------------------- */

process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
});