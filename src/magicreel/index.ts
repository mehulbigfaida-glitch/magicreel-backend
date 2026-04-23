import "dotenv/config";
import shareRoutes from "../api/share/share.routes";
import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import p2mRoutes from "./p2m/p2m.routes";
import { heroQueue } from "./queue/hero.queue";
import analyticsRoutes from "../api/analytics";

/* ---------------------------------- */
/* APP INIT */
/* ---------------------------------- */

const app = express();

/* ---------------------------------- */
/* 🔍 DEBUG TRACE */
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

app.use(cors({
  origin: "https://magicreel-frontend.vercel.app",
  credentials: true,
}));

app.use(express.json({ limit: "20mb" }));

/* ---------------------------------- */
/* ROUTES */
/* ---------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionsRoutes);
app.use("/api/share", shareRoutes);

/* ---------------------------------- */
/* 🧪 QUEUE TEST */
/* ---------------------------------- */

app.get("/api/test-queue", async (_req, res) => {
  console.log("🧪 TEST QUEUE START");

  heroQueue
    .add("test-job", {
      jobId: "test123",
    })
    .then(() => {
      console.log("✅ Job added");
    })
    .catch((err) => {
      console.error("❌ Queue error:", err.message);
    });

  return res.json({
    message: "queued (non-blocking)",
  });
});

/* ---------------------------------- */
/* 👗 P2M ROUTES */
/* ---------------------------------- */

// ✅ IMPORTANT: REMOVE GLOBAL AUTH HERE
app.use("/api/p2m", p2mRoutes);
app.use("/api/analytics", analyticsRoutes);
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