import { Router } from "express";

const router = Router();

/**
 * Deprecated TryOn V2
 * Kept only to avoid breaking old clients
 */
router.post("/run", (_req, res) => {
  res.status(410).json({
    error: "Deprecated. Use /api/p2m instead.",
  });
});

export default router;
