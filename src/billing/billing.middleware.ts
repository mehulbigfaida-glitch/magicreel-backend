import { Request, Response, NextFunction } from "express";
import { prisma } from "../magicreel/db/prisma";

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

const billingGuard = (feature: FeatureType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!prisma) {
        return res.status(500).json({ error: "Prisma not initialized" });
      }

      // ✅ DEV MODE: skip auth, use fixed user
      const user = await prisma.user.findUnique({
        where: { id: DEV_USER_ID },
      });

      if (!user) {
        return res.status(404).json({
          error: "Dev user not found. Please create user with id = dev-user",
        });
      }

      const creditsRequired = featureCredits[feature];

      // ✅ ONLY VALIDATE — DO NOT DEDUCT
      if (user.creditsAvailable < creditsRequired) {
        return res.status(400).json({
          error: "Insufficient credits",
        });
      }

      // ✅ PASS BILLING INFO FOR LATER (SUCCESS-ONLY DEDUCTION)
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

export { billingGuard };