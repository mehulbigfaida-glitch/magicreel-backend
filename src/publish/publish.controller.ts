import { Request, Response } from "express";
import { publishService } from "./publish.service";

export class PublishController {
  async publish(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const { platform, assetUrl, assetType, caption } = req.body;
      const result = await publishService.publish({
        userId,
        platform,
        assetUrl,
        assetType,
        caption,
      });

      return res.json({ success: true, data: result });
    } catch (error: any) {
      // Never log the raw Axios error: its request config can include the
      // Instagram access token in a URL/query parameter.
      const metaError = error?.response?.data?.error;
      console.error("PUBLISH ERROR", {
        message: error?.message ?? "Unknown error",
        status: error?.response?.status,
        metaCode: metaError?.code,
        metaSubcode: metaError?.error_subcode,
        metaType: metaError?.type,
        metaMessage: metaError?.message,
        fbtraceId: metaError?.fbtrace_id,
      });

      return res.status(400).json({
        success: false,
        error: error?.message || "Unknown error",
        ...(metaError
          ? {
              details: {
                code: metaError.code,
                subcode: metaError.error_subcode,
                type: metaError.type,
                message: metaError.message,
                fbtrace_id: metaError.fbtrace_id,
              },
            }
          : {}),
      });
    }
  }
}

export const publishController = new PublishController();
