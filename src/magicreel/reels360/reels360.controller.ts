import { Request, Response } from "express";
import { reels360Service } from "./reels360.service";

export class Reels360Controller {
  async generate(req: Request, res: Response) {
    try {
      const { heroImageUrl, backHeroImageUrl } = req.body;

      const result = await reels360Service.generate({
        heroImageUrl,
        backHeroImageUrl,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("360 REEL GENERATION ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to generate 360 reel",
      });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const { runId } = req.params;

      const result = await reels360Service.getStatus(runId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("360 REEL STATUS ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to fetch reel status",
      });
    }
  }
}

export const reels360Controller = new Reels360Controller();