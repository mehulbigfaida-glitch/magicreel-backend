import { Request, Response } from "express";

import {
  buildCampaignOutputs,
} from "../../magicreel/editorial/campaignOutputBuilder";

import {
  generateEditorialDirection,
} from "../../magicreel/editorial/editorialDirectionGenerator";

export async function generateCampaign(
  req: Request,
  res: Response
) {
  try {
    const {
      editorialWorld,
      outputs,
      heroImageUrl,
      logoImageUrl,
    } = req.body;

    if (
  !editorialWorld ||
  !heroImageUrl
) {
      return res.status(400).json({
        error:
          "Missing editorialWorld, outputs, or heroImageUrl",
      });
    }

    const promptAssets = [
  {
    output: "instagram-post",
  },
];

    const generatedAssets =
      [];

    for (const asset of promptAssets) {
  const generated =
    await generateEditorialDirection({
      heroImageUrl,

      logoImageUrl,

      editorialWorld,

      output:
        asset.output,
    });

  generatedAssets.push({
    output:
      asset.output,

    imageUrl:
      generated.imageUrl,

    prompt:
      generated.prompt,
  });
}

    return res.json({
      success: true,

      editorialWorld,

      assets:
        generatedAssets,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      error:
        error.message ||
        "Failed to generate campaign",
    });
  }
}