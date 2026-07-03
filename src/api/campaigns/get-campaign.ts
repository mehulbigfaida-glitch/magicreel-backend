import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export async function getCampaign(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const campaign =
      await prisma.campaign.findUnique({
        where: {
          id,
        },
      });

    if (!campaign) {
      return res.status(404).json({
        error: "Campaign not found",
      });
    }

    return res.json({
      id: campaign.id,

      status:
        campaign.status,

      heroImageUrl:
        campaign.heroImageUrl,

      outputImageUrl:
        campaign.outputImageUrl,

      outputImageUrls:
        campaign.outputImageUrls || [],

      campaignType:
        campaign.campaignType,

      tone:
        campaign.tone,

      createdAt:
        campaign.createdAt,
    });

  } catch (err: any) {

    console.error(
      "GET CAMPAIGN ERROR:",
      err
    );

    return res.status(500).json({
      error:
        err.message ||
        "Failed to fetch campaign",
    });
  }
}