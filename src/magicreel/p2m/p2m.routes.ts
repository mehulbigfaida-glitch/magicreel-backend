console.log("ENABLE_BILLING:", process.env.ENABLE_BILLING);

import rateLimit from "express-rate-limit";
import { Router, Request, Response, NextFunction } from "express";

import heroRoutes from "../../api/p2m/hero";
import lookbookRoutes from "../../api/p2m/lookbook";
import cinematicRoutes from "./cinematic.routes";

import { billingGuard } from "../../billing/billing.middleware";

import { generateReelV1Controller } from "../../api/p2m/reel/generate-v1";
import { getReelStatus } from "../../api/p2m/reel/status";

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
   🎬 CINEMATIC
---------------------------------- */

router.use("/cinematic", cinematicRoutes);

/* ----------------------------------
   🎬 REEL V1 (3 credits)
---------------------------------- */

router.post(
  "/reel/generate-v1",
  optionalBilling("REEL"), // ✅ 3 credits
  generateReelV1Controller
);

router.get("/reel/status/:jobId", getReelStatus);

/* ----------------------------------
   👗 HERO (1 credit)
---------------------------------- */

router.use(
  "/hero",
  heroLimiter,
  optionalBilling("HERO"), // ✅ FIX ADDED
  heroRoutes
);

/* ----------------------------------
   📚 LOOKBOOK (2 credits)
---------------------------------- */

router.use(
  "/lookbook",
  optionalBilling("LOOKBOOK_ECOM"), // ✅ 2 credits
  lookbookRoutes
);

export default router;