import "../lib/redis";
import "dotenv/config";

import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import { authenticate } from "../auth/jwt.middleware";
import p2mRoutes from "./p2m/p2m.routes";

/* ---------------------------------- */
/* 🚀 APP INIT */
/* ---------------------------------- */

const app = express();

/* ---------------------------------- */
/* 🚀 HEALTH FIRST (CRITICAL) */
/* ---------------------------------- */

app.get("/ping", (_req, res) => {
  res.status(200).send("pong");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send("MagicReel backend running ✅");
});

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
app.use("/api/p2m", authenticate, p2mRoutes);

/* ---------------------------------- */
/* 🚀 START SERVER IMMEDIATELY */
/* ---------------------------------- */

const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error("❌ PORT not provided");
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 Server listening on ${PORT}`);
});

/* ---------------------------------- */
/* 🔥 CONNECT DB AFTER START */
/* ---------------------------------- */

prisma.$connect()
  .then(() => console.log("✅ Prisma connected"))
  .catch((err) => console.error("❌ Prisma failed:", err));

/* ---------------------------------- */
/* 🔥 KEEP ALIVE */
/* ---------------------------------- */

setInterval(() => {
  console.log("🔄 keep alive");
}, 15000);

/* ---------------------------------- */

process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
});