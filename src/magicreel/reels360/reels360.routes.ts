import { Router } from "express";
import { authenticate } from "../../auth/jwt.middleware";

import { reels360Controller } from "./reels360.controller";

const router = Router();

/* ================= 360 REEL GENERATION ================= */

router.post(
  "/generate",
  authenticate,
  (req, res) =>
    reels360Controller.generate(req, res)
);

/* ================= 360 REEL STATUS ================= */

router.get(
  "/status/:runId",
  authenticate,
  (req, res) =>
    reels360Controller.getStatus(req, res)
);

export default router;