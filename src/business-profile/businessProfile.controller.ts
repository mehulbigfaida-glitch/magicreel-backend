import { Request, Response } from "express";
import {
  getBusinessProfile,
  updateBusinessProfile,
  updateBusinessLogo,
} from "./businessProfile.service";

/**
 * ------------------------------------------------------------
 * GET /business-profile
 * ------------------------------------------------------------
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const profile = await getBusinessProfile(userId);

    res.json({
      profile,
    });
  } catch (err: any) {
    console.error("Get Business Profile:", err);

    res.status(500).json({
      error: err.message || "Failed to fetch business profile",
    });
  }
}

/**
 * ------------------------------------------------------------
 * PUT /business-profile
 * ------------------------------------------------------------
 */
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const profile = await updateBusinessProfile(
      userId,
      req.body
    );

    res.json({
      message: "Business profile updated successfully",
      profile,
    });
  } catch (err: any) {
    console.error("Update Business Profile:", err);

    res.status(500).json({
      error: err.message || "Failed to update business profile",
    });
  }
}

/**
 * ------------------------------------------------------------
 * POST /business-profile/logo
 * ------------------------------------------------------------
 *
 * For now this endpoint simply saves the logo URL.
 * Later, Cloudinary upload can be added here without
 * changing the frontend API.
 */
export async function updateLogo(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { logoUrl } = req.body;

    if (!logoUrl) {
      return res.status(400).json({
        error: "logoUrl is required",
      });
    }

    const profile = await updateBusinessLogo(
      userId,
      logoUrl
    );

    res.json({
      message: "Logo updated successfully",
      profile,
    });
  } catch (err: any) {
    console.error("Update Logo:", err);

    res.status(500).json({
      error: err.message || "Failed to update logo",
    });
  }
}