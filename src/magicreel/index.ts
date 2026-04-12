import "dotenv/config";

import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import { authenticate } from "../auth/jwt.middleware";
import p2mRoutes from "./p2m/p2m.routes";
import { heroQueue } from "./queue/hero.queue";

/* ---------------------------------- */
/* APP INIT */
/* ---------------------------------- */

const app = express();

/* ---------------------------------- */
/* 🔍 DEBUG TRACE (VERY IMPORTANT) */
/* ---------------------------------- */

app.use((req, _res, next) => {
  console.log("🌍 GLOBAL HIT:", req.originalUrl);
  next();
});

/* ---------------------------------- */
/* 🔥 HEALTH ROUTES */
/* ---------------------------------- */

app.get("/health", (_req, res) => {
  return res.status(200).send("ok");
});

app.get("/ping", (_req, res) => {
  return res.status(200).send("pong");
});

app.get("/", (_req, res) => {
  res.send("MagicReel backend running ✅");
});

/* ---------------------------------- */
/* MIDDLEWARE */
/* ---------------------------------- */

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://magicreel-frontend.vercel.app",
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));

/* ---------------------------------- */
/* ROUTES */
/* ---------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionsRoutes);

/* ---------------------------------- */
/* 🧪 QUEUE TEST (PUBLIC) */
/* ---------------------------------- */

app.get("/api/test-queue", async (_req, res) => {
  try {
    console.log("🧪 TEST QUEUE ROUTE HIT");

    const job = await heroQueue.add("test-job", {
      jobId: "test123",
    });

    return res.json({
      message: "Job added",
      jobId: job.id,
    });
  } catch (err: any) {
    console.error("❌ Queue test failed:", err.message);

    return res.status(500).json({
      error: "Queue test failed",
    });
  }
});

/* ---------------------------------- */
/* 👗 P2M ROUTES (PROTECTED) */
/* ---------------------------------- */

app.use("/api/p2m", authenticate, p2mRoutes);

/* ---------------------------------- */
/* 🚀 SERVER START */
/* ---------------------------------- */

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🟢 Server listening on ${PORT}`);
  console.log("🌐 Server fully initialized and ready");

  prisma
    .$connect()
    .then(() => console.log("✅ Prisma connected"))
    .catch((err) => console.error("❌ Prisma failed:", err));
});

/* ---------------------------------- */
/* 🔥 KEEP ALIVE */
/* ---------------------------------- */

setInterval(() => {
  console.log("🔄 keep alive");
}, 15000);

/* ---------------------------------- */
/* SAFETY */
/* ---------------------------------- */

process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
});