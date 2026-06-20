import { Request, Response } from "express";
import { publishAiService } from "./publishAi.service";

export async function generatePublishContent(
  req: Request,
  res: Response
) {

  try {

    const {
      imageUrl,
      platform,
      garmentType,
      tone
    } = req.body;

    if (!imageUrl) {

      return res.status(400).json({

        success: false,
        error: "imageUrl is required"

      });

    }

    const result =
      await publishAiService.generateContent({

        imageUrl,
        platform,
        garmentType,
        tone

      });

    return res.json({

      success: true,

      caption:
        result.caption,

      hashtags:
        result.hashtags,

      cta:
        result.cta

    });

  } catch (error: any) {

    console.error(
      "PUBLISH AI ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        error?.message ||
        "Failed to generate content"

    });

  }

}