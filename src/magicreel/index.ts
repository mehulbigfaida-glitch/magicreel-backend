import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "../auth/auth.routes";
import p2mRoutes from "./p2m/p2m.routes"; // ✅ ADD THIS

console.log("BOOT ENV CHECK", {
  PORT: process.env.PORT,
  PROMPT_ONLY: process.env.PROMPT_ONLY,
});

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://magicreel-frontend.vercel.app",
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));

/* ----------------------------------
   HEALTHCHECK
---------------------------------- */

app.get("/", (_req, res) => {
  res.send("MagicReel backend running ✅");
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

/* ----------------------------------
   ROUTES
---------------------------------- */

app.use("/api/auth", authRoutes);

// 🔥 ADD THIS LINE (CRITICAL)
app.use("/api/p2m", p2mRoutes);

/* ----------------------------------
   SERVER START
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

process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection:", err);
});