import { Request, Response, NextFunction } from "express";
import { prisma as prismaClient } from "../magicreel/db/prisma";

const prisma = prismaClient!; // ✅ force non-null (safe in runtime)

export type FeatureType =
  | "HERO"
  | "LOOKBOOK_ECOM"
  | "REEL"
  | "CINEMATIC_LOOKBOOK"
  | "CINEMATIC_REEL_10S"
  | "CINEMATIC_REEL_20S";

const featureCredits: Record<FeatureType, number> = {
  HERO: 1,
  LOOKBOOK_ECOM: 2,
  REEL: 3,
  CINEMATIC_LOOKBOOK: 3,
  CINEMATIC_REEL_10S: 5,
  CINEMATIC_REEL_20S: 10,
};

const DEV_USER_ID = process.env.DEV_USER_ID!;

/* ----------------------------------
   BILLING GUARD (VALIDATION ONLY)
---------------------------------- */

export const billingGuard = (feature: FeatureType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: DEV_USER_ID },
      });

      if (!user) {
        return res.status(404).json({
          error: "Dev user not found",
        });
      }

      const creditsRequired = featureCredits[feature];

      if (user.creditsAvailable < creditsRequired) {
        return res.status(400).json({
          error: "Insufficient credits",
        });
      }

      (req as any).billing = {
        userId: user.id,
        feature,
        creditsRequired,
      };

      (req as any).user = user;

      next();
    } catch (error: any) {
      console.error("BILLING ERROR:", error);
      return res.status(400).json({
        error: error.message || "Billing validation failed",
      });
    }
  };
};

/* ----------------------------------
   FINALIZE BILLING (SUCCESS ONLY)
---------------------------------- */

export const finalizeBilling = async (req: Request) => {
  const billing = (req as any).billing;

  if (!billing) return;

  const { userId, feature, creditsRequired } = billing;

  await prisma.$transaction([ 
  prisma.user.update({
    where: { id: userId },
    data: {
      creditsAvailable: {
        decrement: creditsRequired,
      },
    },
  }),

  prisma.creditTransaction.create({
    data: {
      userId,
      feature,
      credits: creditsRequired,
      type: "DEBIT",
      status: "COMPLETED", // ✅ REQUIRED FIX
    },
  }),
]);
};

export async function checkCreditsOrThrow(req: any, required: number) {
  const user = req.user;

  if (!user) {
    const err: any = new Error("Unauthorized");
    err.code = "UNAUTHORIZED";
    throw err;
  }

  // ⚠️ TEMP LOGIC (replace later with real credit system)
  const availableCredits = user.plan === "FREE" ? 0 : 100;

  if (availableCredits < required) {
    const err: any = new Error("INSUFFICIENT_CREDITS");
    err.code = "INSUFFICIENT_CREDITS";
    err.required = required;
    err.available = availableCredits;
    throw err;
  }
}