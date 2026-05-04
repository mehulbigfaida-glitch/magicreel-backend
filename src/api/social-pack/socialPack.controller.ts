import { Request, Response } from "express";

import {
  buildSocialPackPrompt,
} from "../../magicreel/fashion-intelligence/social-pack/socialPackPromptBuilder";

import {
  SocialPackPayload,
} from "./socialPack.types";

export async function generateSocialPack(
  req: Request,
  res: Response
) {
  try {
    const payload =
      req.body as SocialPackPayload;

    const orchestration =
      buildSocialPackPrompt(
        payload
      );

    return res.json({
      success: true,

      orchestration,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error:
        "Failed to generate social pack orchestration",
    });
  }
}