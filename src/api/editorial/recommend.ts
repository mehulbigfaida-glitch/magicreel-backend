import { Request, Response } from "express";

import { buildEditorialDirection } from "../../magicreel/editorial/editorialDirector";

export async function recommendEditorialWorld(
  req: Request,
  res: Response
) {
  try {
    const result = buildEditorialDirection({
      category:
        req.body.category ||
        "black evening gown",

      western: req.body.western ?? true,

      colorPalette:
        req.body.colorPalette || [
          "black",
        ],

      silhouette:
        req.body.silhouette ||
        "structured couture",

      mood:
        req.body.mood ||
        "luxury cinematic fashion",

      jewelryHeavy:
        req.body.jewelryHeavy ?? true,
    });

    return res.json({
      success: true,

      recommendation: {
        primaryWorld:
          result.primaryWorld,

        emotionalThesis:
          result.emotionalThesis,

        atmosphere:
          result.atmosphereDirection,

        typography:
          result.typographyDirection,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate editorial recommendation.",
    });
  }
}