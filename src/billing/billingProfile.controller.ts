import { Request, Response } from "express";

import {
  getBillingProfile,
  updateBillingProfile,
} from "./billingProfile.service";

export async function getBilling(
  req: Request,
  res: Response
) {
  try {
    const userId =
      (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const profile =
      await getBillingProfile(userId);

    if (!profile) {
      return res.status(404).json({
        error: "Billing profile not found",
      });
    }

    return res.json(profile);

  } catch (error: any) {
    console.error(
      "GET BILLING PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to fetch billing profile",
    });
  }
}

export async function updateBilling(
  req: Request,
  res: Response
) {
  try {
    const userId =
      (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const profile =
      await updateBillingProfile(
        userId,
        req.body || {}
      );

    return res.json(profile);

  } catch (error: any) {
    console.error(
      "UPDATE BILLING PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to update billing profile",
    });
  }
}
