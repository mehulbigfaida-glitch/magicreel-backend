import "dotenv/config";

import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import { authenticate } from "../auth/jwt.middleware";

import lookbookRoutes from "./routes/lookbook.routes";
import exportRoutes from "./routes/exportRoutes";
import lookbookExportRoutes from "./routes/lookbookExport.routes";
import tryonRoutesV2 from "./routes/tryonRoutesV2";
import { garmentRoutes } from "./routes/garment.routes";
import { tryonRoutes } from "./routes/tryon.routes";
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

app.use(cors());
app.use(express.json({ limit: "20mb" }));

/* ----------------------------------
   🔥 TEST ROUTE (CRITICAL DEBUG)
---------------------------------- */

app.get("/test-hit", (_req, res) => {
  console.log("🔥 TEST ROUTE HIT");
  res.json({ ok: true });
});

/* ----------------------------------
   🔓 PUBLIC ROUTES
---------------------------------- */

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* ----------------------------------
   🔎 DEBUG USER ROUTE
---------------------------------- */

app.get("/debug/user", async (_req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: "test2@magicreel.com" },
  });
  res.json(user);
});

/* ----------------------------------
   🔐 PROTECTED ROUTES
---------------------------------- */

// Lookbook generation routes
app.use("/api/lookbook", authenticate, lookbookRoutes);

// ⭐ Predictions / Generation History
app.use("/api/predictions", predictionsRoutes);

// 🔥 ZIP EXPORT ROUTE
app.use("/api", lookbookExportRoutes);

// Reel export routes
app.use("/api/export", authenticate, exportRoutes);

app.use("/api/garment", authenticate, garmentRoutes);
app.use("/api/tryon", authenticate, tryonRoutes);
app.use("/api/tryon/v2", authenticate, tryonRoutesV2);

/* ----------------------------------
   🔓 P2M ROUTES (NO AUTH)
---------------------------------- */

app.use("/api/p2m", p2mRoutes);

/* ----------------------------------
   SERVER START
---------------------------------- */

const PORT = Number(process.env.PORT) || 5003;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 MagicReel HTTP server listening on ${PORT}`);
});

server.on("error", (err) => {
  console.error("🔴 Server listen error", err);
});