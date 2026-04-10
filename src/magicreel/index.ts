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
/* APP INIT */
/* ---------------------------------- */

const app = express();

/* ---------------------------------- */
/* HEALTH ROUTES (TOP PRIORITY) */
/* ---------------------------------- */

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ping", (_req, res) => {
  res.status(200).send("pong");
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
/* SERVER START (RAILWAY SAFE) */
/* ---------------------------------- */

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 Server listening on ${PORT}`);
  console.log("🌐 Server fully initialized and ready");
});

/* ---------------------------------- */
/* DB CONNECT (NON-BLOCKING) */
/* ---------------------------------- */

prisma.$connect()
  .then(() => console.log("✅ Prisma connected"))
  .catch((err) => console.error("❌ Prisma failed:", err));

/* ---------------------------------- */
/* KEEP ALIVE */
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