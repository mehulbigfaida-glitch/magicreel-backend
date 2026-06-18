import { Request, Response } from "express";
import { publishService } from "./publish.service";

export class PublishController {
  async publish(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      const {
        platform,
        assetUrl,
        assetType,
        caption,
      } = req.body;

      const result =
        await publishService.publish({
          userId,
          platform,
          assetUrl,
          assetType,
          caption,
        });

      return res.json({
        success: true,
        data: result,
      });

    } catch (error: any) {
      console.error("PUBLISH ERROR:", error);

      return res.status(400).json({
        success: false,
        error: error?.message || "Unknown error",
        details: error?.response?.data || error,
      });
    }
  }
}

export const publishController =
  new PublishController();