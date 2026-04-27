import "dotenv/config";
import express from "express";
import cors from "cors";

import { prisma } from "./db/prisma";

// ROUTES
import authRoutes from "../auth/auth.routes";
import predictionsRoutes from "../api/predictions";
import shareRoutes from "../api/share/share.routes";
import p2mRoutes from "./p2m/p2m.routes";
import analyticsRoutes from "../api/analytics";
import adminRoutes from "../api/admin";

// ✅ PAYMENT IMPORTS (ADD THIS)
import { createOrder } from "../api/payments/create-order";
import { verifyPayment } from "../api/payments/verify-payment";

// BILLING
import { upgradePlan } from "../billing/upgrade";
import { authenticate } from "../auth/jwt.middleware";

// QUEUE
// import { heroQueue } from "./queue/hero.queue";

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

app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/ping", (_req, res) => res.status(200).send("pong"));
app.get("/", (_req, res) =>
  res.send("MagicReel backend running ✅")
);

/* ---------------------------------- */
/* MIDDLEWARE */
/* ---------------------------------- */

app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));

/* ---------------------------------- */
/* ROUTES */
/* ---------------------------------- */

// AUTH
app.use("/api/auth", authRoutes);

// BILLING (PROTECTED)
app.post("/api/billing/upgrade", authenticate, upgradePlan);

// ✅ PAYMENT ROUTES (ADD THIS BLOCK)
app.post("/api/payments/create-order", authenticate, createOrder);
app.post("/api/payments/verify-payment", authenticate, verifyPayment);

// CORE APIs
app.use("/api/predictions", predictionsRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/p2m", p2mRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------------------------- */
/* 🧪 QUEUE TEST */
/* ---------------------------------- */

app.get("/api/test-queue", async (_req, res) => {
  console.log("🧪 TEST QUEUE START");

  // ⚠️ Queue disabled for now (local dev)
// heroQueue.add("test-job", { jobId: "test123" })
//   .then(() => console.log("✅ Job added"))
//   .catch((err: any) =>
//     console.error("❌ Queue error:", err.message)
//   );

console.log("⚠️ Queue skipped (disabled)");

  return res.json({
    message: "queued (non-blocking)",
  });
});

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