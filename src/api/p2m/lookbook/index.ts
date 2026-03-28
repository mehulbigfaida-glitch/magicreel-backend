import { Router } from "express";
import { generateLookbookV2 } from "./generate-v2";
import { getLookbookStatus } from "./status";

const router = Router();

// 🚫 NO AUTH, ONLY BILLING HANDLED UPSTREAM

router.post(
  "/generate-v2",
  generateLookbookV2
);

router.get(
  "/status",
  getLookbookStatus
);

export default router;