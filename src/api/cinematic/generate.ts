import { Request, Response } from "express";

import { generateCinematicPack } from "../../magicreel/cinematic/generateCinematicPack";

/* ------------------------------------------------------- */

export async function generateCinematic(
  req: Request,
  res: Response
) {
  try {
    const {
      heroImageUrl,
      logoUrl,
      worldId,
      brandName,
      seed,
    } = req.body;

    /*
      ----------------------------------------------------
      BASIC VALIDATION
      ----------------------------------------------------
    */

    if (!heroImageUrl) {
      return res.status(400).json({
        success: false,
        error: "heroImageUrl is required",
      });
    }

    if (!worldId) {
      return res.status(400).json({
        success: false,
        error: "worldId is required",
      });
    }

    /*
      ----------------------------------------------------
      GENERATE CINEMATIC PACK
      ----------------------------------------------------
    */

    const result = await generateCinematicPack({
      heroImageUrl,
      logoUrl,
      worldId,
      brandName,
      seed,
    });

    /*
      ----------------------------------------------------
      SUCCESS RESPONSE
      ----------------------------------------------------
    */

    return res.json({
      success: true,

      cinematic: result,
    });
  } catch (error: any) {
    console.error("Cinematic generation error:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Failed to generate cinematic campaign",
    });
  }
}