console.log("ENABLE_BILLING:", process.env.ENABLE_BILLING);

import rateLimit from "express-rate-limit";
import { Router, Request, Response, NextFunction } from "express";

import heroRoutes from "../../api/p2m/hero";
import lookbookRoutes from "../../api/p2m/lookbook";

import { billingGuard } from "../../billing/billing.middleware";

import { generateReelV1Controller } from "../../api/p2m/reel/generate-v1";
import { getReelStatus } from "../../api/p2m/reel/status";
import { heroQueue } from "../queue/hero.queue";

// ✅ PUBLIC CONTROLLER (NO AUTH)
import { getLookbookById } from "../../api/p2m/lookbook/get-lookbook";

/* ----------------------------------
   CONFIG FLAGS
---------------------------------- */

const ENABLE_BILLING = process.env.ENABLE_BILLING === "true";

/* ----------------------------------
   SAFE MIDDLEWARE WRAPPER
---------------------------------- */

const optionalBilling = (feature: any) => {
  if (ENABLE_BILLING) {
    return billingGuard(feature);
  }

  return (_req: Request, _res: Response, next: NextFunction) => next();
};

/* ----------------------------------
   RATE LIMITER
---------------------------------- */

const heroLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many hero generation requests. Please wait a moment.",
  },
});

/* ----------------------------------
   ROUTER
---------------------------------- */

const router = Router();

/* ----------------------------------
   🧪 QUEUE TEST (PUBLIC)
---------------------------------- */

router.get("/test-queue", async (_req, res) => {
  try {
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

/* ----------------------------------
   🎬 REEL V1
---------------------------------- */

router.post(
  "/reel/generate-v1",
  optionalBilling("REEL"),
  generateReelV1Controller
);

router.get("/reel/status/:jobId", getReelStatus);

/* ----------------------------------
   👗 HERO
---------------------------------- */

router.use(
  "/hero",
  heroLimiter,
  optionalBilling("HERO"),
  heroRoutes
);

/* ----------------------------------
   📚 LOOKBOOK
---------------------------------- */

/**
 * ✅ CRITICAL:
 * This MUST be defined BEFORE router.use("/lookbook")
 * This route is PUBLIC (no auth, no billing)
 */
router.get("/lookbook/:id", (req, res) => {
  return getLookbookById(req, res);
});

/**
 * 🔒 Protected lookbook routes
 */
router.use(
  "/lookbook",
  optionalBilling("LOOKBOOK_ECOM"),
  lookbookRoutes
);

export default router;