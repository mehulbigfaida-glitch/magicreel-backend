import { Request, Response, NextFunction } from "express";
import { prisma } from "../magicreel/db/prisma";
import { BillingService } from "./billing.service";

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

export function billingGuard(feature: FeatureType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user;

      if (!authUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const creditsRequired = featureCredits[feature];

      await BillingService.deductCreditsAtomic(
        user.id,
        feature,
        creditsRequired
      );

      (req as any).user = user;

      next();

    } catch (error: any) {
      console.error("BILLING ERROR:", error);
      return res.status(400).json({
        error: error.message || "Billing failed",
      });
    }
  };
}