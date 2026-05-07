import { Request, Response } from "express";
import { generateSocialPackExecutor } from "../../magicreel/fashion-intelligence/social-pack/socialPackExecutor";

/* =========================================================
   TEMP BILLING (SAFE MOCK)
========================================================= */

async function getUserCredits(userId: string) {
  // TODO: replace with Supabase later
  return 100;
}

async function deductCredits(userId: string, amount: number) {
  console.log(`Deducting ${amount} credits from ${userId}`);
}

/* =========================================================
   HANDLER
========================================================= */

export default async function handler(
  req: Request,
  res: Response
) {
  try {
    const { outputs, inputs } = req.body;

    const userId = "test-user"; // safe fallback (no req.user dependency)

    if (!outputs || outputs.length === 0) {
      return res.status(400).json({
        error: "No outputs selected",
      });
    }

    /* ================= CREDIT CHECK ================= */

    const credits = await getUserCredits(userId);

    if (credits < outputs.length) {
      return res.status(400).json({
        error: "Not enough credits",
      });
    }

    /* ================= GENERATION ================= */

    const { results, successCount } =
      await generateSocialPackExecutor({
        outputs,
        inputs,
      });

    /* ================= CREDIT DEDUCTION ================= */

    if (successCount > 0) {
      await deductCredits(userId, successCount);
    }

    /* ================= RESPONSE ================= */

    return res.json(results);
  } catch (err: any) {
  console.error("SOCIAL PACK ERROR:", err);

  return res.status(500).json({
    success: false,
    error: err?.message || "Unknown error",
    stack: err?.stack,
  });
}
}