import { Request, Response, NextFunction } from "express";
import { prisma } from "../magicreel/db/prisma";

export type FeatureType =
  | "HERO"
  | "LOOKBOOK_ECOM"
  | "REEL"
  | "CAMPAIGN_ENGINE"
  | "EDITORIAL"
  | "CINEMATIC_LOOKBOOK"
  | "CINEMATIC_REEL_10S"
  | "CINEMATIC_REEL_20S";

const featureCredits: Record<FeatureType, number> = {
  HERO: 1,
  LOOKBOOK_ECOM: 2,
  REEL: 3,
  CAMPAIGN_ENGINE: 1,
  EDITORIAL: 1,
  CINEMATIC_LOOKBOOK: 3,
  CINEMATIC_REEL_10S: 5,
  CINEMATIC_REEL_20S: 10,
};

const DEV_USER_ID = process.env.DEV_USER_ID!;

/* ----------------------------------
   BILLING GUARD
---------------------------------- */

export const billingGuard = (feature: FeatureType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = (req as any).user;

      if (!user) {
        user = await prisma.user.findUnique({
          where: { id: DEV_USER_ID },
        });

        if (!user) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        (req as any).user = user;
      }

      const creditsRequired = featureCredits[feature];

      const freshUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      const availableCredits = freshUser?.creditsAvailable ?? 0;

      if (availableCredits < creditsRequired) {
        return res.status(400).json({
          error: "Insufficient credits",
        });
      }

      // ✅ IMPORTANT: billing object (we will attach predictionId here)
      (req as any).billing = {
  userId: user.id,
  feature,
  creditsRequired,
  predictionId: null,
};

console.log("✅ BILLING GUARD HIT", {
  userId: user.id,
  feature,
  creditsRequired,
});

next();
    } catch (error: any) {
      console.error("BILLING ERROR:", error);
      return next();
    }
  };
};

/* ----------------------------------
   FINALIZE BILLING
---------------------------------- */

export const finalizeBilling = async (req: Request) => {
  try {
    console.log("🔥 FINALIZE BILLING CALLED");

    const user = (req as any).user;

    console.log("👤 USER:", user);

    if (!user || !user.id) {
      console.log("❌ NO USER FOUND");
      return;
    }

    const billing = (req as any).billing;

    console.log("📦 BILLING:", billing);

    if (!billing) {
      console.log("❌ NO BILLING OBJECT");
      return;
    }

    const {
      feature,
      creditsRequired,
      predictionId,
    } = billing;

    console.log("💳 DEDUCTING:", {
      userId: user.id,
      feature,
      creditsRequired,
      predictionId,
    });

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          creditsAvailable: {
            decrement: creditsRequired,
          },
        },
      }),

      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          feature,
          credits: creditsRequired,
          type: "DEBIT",
          status: "COMPLETED",
          predictionId,
        },
      }),
    ]);

    console.log("✅ BILLING COMPLETED");

  } catch (err) {
    console.error("❌ FINAL BILLING FAILED:", err);
  }
};

/* ----------------------------------
   STRICT CHECK (USED BY REEL)
---------------------------------- */

export async function checkCreditsOrThrow(req: any, required: number) {
  const user = req.user;

  if (!user) {
    const err: any = new Error("UNAUTHORIZED");
    err.code = "UNAUTHORIZED";
    throw err;
  }

  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const availableCredits = freshUser?.creditsAvailable ?? 0;

  console.log("CREDITS DEBUG:", {
    userId: user.id,
    availableCredits,
    required,
  });

  if (availableCredits < required) {
    const err: any = new Error("INSUFFICIENT_CREDITS");
    err.code = "INSUFFICIENT_CREDITS";
    err.required = required;
    err.available = availableCredits;
    throw err;
  }
}