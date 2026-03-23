import { Request, Response } from "express";
import path from "path";
import { finalizeHeroImage } from "../services/heroFinalization.service";

export async function generateHeroImage(
  req: Request,
  res: Response
) {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        error: "JOB_ID_REQUIRED"
      });
    }

    const outputRoot = path.join(
      __dirname,
      "..",
      "outputs",
      jobId
    );

    finalizeHeroImage({
      jobId,
      outputRoot,
      // Optional future params from View:
      // backgroundImagePath,
      // logoImagePath,
      // enhance
    });

    return res.json({
      success: true,
      heroFinalPath: `outputs/${jobId}/hero/hero_final.png`
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "HERO_FINALIZATION_FAILED"
    });
  }
}
