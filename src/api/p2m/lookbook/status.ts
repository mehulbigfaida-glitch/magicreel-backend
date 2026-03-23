import { Request, Response } from "express";
import { FashnService } from "../../../magicreel/services/fashn.service";
import { enhanceHeroImage } from "../../../magicreel/services/heroEnhance.service";

const fashnService = new FashnService();

export async function getLookbookStatus(req: Request, res: Response) {
  try {
    const runIdsParam = req.query.runIds;

    if (!runIdsParam) {
      return res.status(400).json({
        error: "runIds query parameter is required",
      });
    }

    const runIds = (runIdsParam as string).split(",");

    const results: Record<string, any> = {};

    for (const runId of runIds) {
      const status = await fashnService.pollStatus(runId);

      // If still running, just return status
      if (status.status !== "completed") {
        results[runId] = {
          status: status.status,
        };
        continue;
      }

      const rawImageUrl = status.output?.[0];

      if (!rawImageUrl) {
        results[runId] = {
          status: "failed",
          error: "No output from FASHN",
        };
        continue;
      }

      // 🔒 Enhance the pose image
      const enhanced = await enhanceHeroImage({
        jobId: runId,
        heroBaseUrl: rawImageUrl,
      });

      results[runId] = {
        status: "completed",
        outputImageUrl: enhanced.heroPreviewUrl,
      };
    }

    return res.json({
      runs: results,
    });
  } catch (error: any) {
    console.error("Lookbook status error:", error);
    return res.status(500).json({
      error: "Failed to fetch lookbook status",
    });
  }
}
