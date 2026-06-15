import { Request, Response } from "express";

import { reels360Service } from "./reels360.service";

import { prisma } from "../db/prisma";

import {
  checkCreditsOrThrow,
  finalizeBilling,
} from "../../billing/billing.middleware";

export class Reels360Controller {

  async generate(
    req: Request,
    res: Response
  ) {
    try {

      const {
        heroImageUrl,
        backHeroImageUrl,
      } = req.body;

      /* ----------------------------------
         💳 CREDIT CHECK
      ---------------------------------- */

      await checkCreditsOrThrow(
        req,
        3
      );

      /* ----------------------------------
         🎬 SUBMIT FAL JOB
      ---------------------------------- */

      const result =
        await reels360Service.generate({
          heroImageUrl,
          backHeroImageUrl,
        });

      /* ----------------------------------
         💾 CREATE REEL JOB
      ---------------------------------- */

      await (prisma as any).reelJob.create({
        data: {
          id: result.runId,
          status: "processing",
          inputImageUrl: heroImageUrl,
        },
      });

      /* ----------------------------------
         💰 BILLING
      ---------------------------------- */

      (req as any).billing = {
        userId:
          (req as any).user.id,
        feature: "REEL",
        creditsRequired: 3,
        predictionId:
          result.runId,
      };

      await finalizeBilling(req);

      /* ----------------------------------
         ✅ RESPONSE
      ---------------------------------- */

      return res.status(200).json(
        result
      );

    } catch (error: any) {

      console.error(
        "360 REEL GENERATION ERROR:",
        error
      );

      if (
        error.code ===
        "INSUFFICIENT_CREDITS"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "INSUFFICIENT_CREDITS",
          required:
            error.required,
          available:
            error.available,
        });
      }

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Failed to generate 360 reel",
      });
    }
  }

  async getStatus(
    req: Request,
    res: Response
  ) {
    try {

      const { runId } =
        req.params;

      const result =
        await reels360Service.getStatus(
          runId
        );

      return res.status(200).json(
        result
      );

    } catch (error: any) {

      console.error(
        "360 REEL STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Failed to fetch reel status",
      });
    }
  }
}

export const reels360Controller =
  new Reels360Controller();