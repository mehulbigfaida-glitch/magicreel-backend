import "dotenv/config";

import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma";
import predictionsRoutes from "../api/predictions";
import authRoutes from "../auth/auth.routes";
import { authenticate } from "../auth/jwt.middleware";

// ❌ DISABLED (unstable modules for beta)
// import lookbookRoutes from "./routes/lookbook.routes";
// import exportRoutes from "./routes/exportRoutes";
// import lookbookExportRoutes from "./routes/lookbookExport.routes";
// import tryonRoutesV2 from "./routes/tryonRoutesV2";
// import { garmentRoutes } from "./routes/garment.routes";
// import { tryonRoutes } from "./routes/tryon.routes";

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
   TEST ROUTES
---------------------------------- */

app.get("/test-hit", (_req, res) => {
  console.log("🔥 TEST ROUTE HIT");
  res.json({ ok: true });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* ----------------------------------
   PUBLIC ROUTES
---------------------------------- */

app.use("/api/auth", authRoutes);

/* ----------------------------------
   DEBUG ROUTES (SAFE FOR NOW)
---------------------------------- */

app.get("/debug/user", async (_req, res) => {
  try {
    const user = await prisma?.user.findUnique({
      where: { email: "test2@magicreel.com" },
    });
    res.json(user);
  } catch (err) {
    console.error("DEBUG USER ERROR", err);
    res.status(500).json({ error: "debug failed" });
  }
});

/* ----------------------------------
   CORE WORKING ROUTES ONLY
---------------------------------- */

// ⭐ Predictions / Generation History
app.use("/api/predictions", predictionsRoutes);

// 🔓 P2M ROUTES (NO AUTH)
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