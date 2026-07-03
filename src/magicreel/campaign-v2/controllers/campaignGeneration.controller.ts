/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Generation Controller
 * ============================================================================
 */

import { Request, Response, NextFunction } from "express";

import campaignGenerationService from "../campaignGeneration.service";

import {
  CampaignInput,
} from "../types/campaign.types";

import {
  finalizeBilling,
} from "../../../billing/billing.middleware";

export class CampaignGenerationController {

  /**
   * --------------------------------------------------------------------------
   * Generate Campaign
   * --------------------------------------------------------------------------
   */

  public generateCampaign = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const userId =
        (req as any).user.id as string;

      const input =
        req.body as CampaignInput;

      console.log("===== CAMPAIGN CONTROLLER =====");
      console.log("req.body =", req.body);
      console.log("input =", input);

      const result =
        await campaignGenerationService.generateCampaign(
          userId,
          input
        );

      console.log("===== CONTROLLER RESULT =====");
      console.dir(result, { depth: null });

      // ======================================================
      // FINALIZE BILLING
      // ======================================================

      await finalizeBilling(req);

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {

      next(error);

    }

  };

  public getCampaign = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const campaign =
        await campaignGenerationService.getCampaign(
          req.params.id
        );

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: "Campaign not found",
        });
        return;
      }

      res.json({
        success: true,
        data: campaign,
      });

    } catch (error) {

      next(error);

    }

  };

}

export default new CampaignGenerationController();