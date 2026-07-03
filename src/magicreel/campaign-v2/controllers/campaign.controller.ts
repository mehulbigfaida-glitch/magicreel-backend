/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Controller
 * ============================================================================
 */
console.log("🔥 CAMPAIGN V2 CONTROLLER HIT");
import { Request, Response, NextFunction } from "express";

import { CampaignService } from "../services/campaign.service";
import {
  CampaignValidationError,
  validateCampaignInput,
} from "../validators/campaign.validator";

export class CampaignController {
  private readonly campaignService = new CampaignService();

  public generateCampaign = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      validateCampaignInput(req.body);

      const result = await this.campaignService.generateCampaign(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof CampaignValidationError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }

      next(error);
    }
  };

/**
 * ============================================================================
 * Get Campaign
 * ============================================================================
 */

public getCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaign =
      await this.campaignService.getCampaign(
        req.params.id
      );

    if (!campaign) {
      res.status(404).json({
        success: false,
        error: "Campaign not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });

  } catch (error) {
    next(error);
  }
};
}

export const campaignController = new CampaignController();