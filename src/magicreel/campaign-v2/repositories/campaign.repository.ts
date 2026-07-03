/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Repository
 * ============================================================================
 */

import { prisma } from "../../db/prisma";

import {
  CampaignInput,
  CampaignPersistenceInput,
} from "../types/campaign.types";

export class CampaignRepository {
  /**
   * --------------------------------------------------------------------------
   * Create Campaign
   * --------------------------------------------------------------------------
   */
  public async createCampaign(
  userId: string,
  input: CampaignInput,
  result: CampaignPersistenceInput
) {
    return prisma.campaign.create({
      data: {
        userId,

        heroImageUrl: input.heroImageUrl,

        assetImageUrl:
          input.supportingHeroUrls.length > 0
            ? input.supportingHeroUrls[0]
            : null,

        logoImageUrl: input.logoUrl,

        campaignType: "campaign-v2",

        backgroundStrategy:
          result.vision.creativeDirection,

        campaignCopy: [
          input.headline,
          input.subheadline,
          input.cta,
        ]
          .filter(Boolean)
          .join("\n"),

        tone: result.vision.visualMood,

        outputImageUrl: result.imageUrl,

        outputImageUrls: [result.imageUrl],

        status: "completed",
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Get Campaign
   * --------------------------------------------------------------------------
   */
  public async getCampaignById(
    campaignId: string
  ) {
    return prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });
  }
}

export const campaignRepository =
  new CampaignRepository();