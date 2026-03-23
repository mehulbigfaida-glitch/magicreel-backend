import { Request, Response } from "express";
import { TryOnServiceV2 } from "../services/TryOnServiceV2";

const service = new TryOnServiceV2();

const ANCHOR_MODEL_URL =
  "https://res.cloudinary.com/duaqfspwa/image/upload/v1766744816/riya_Alt_Editorial_hjvxjt.png";

export class TryOnControllerV2 {
  async run(req: Request, res: Response) {
    const { garmentImageUrl } = req.body;

    if (!garmentImageUrl) {
      return res.status(400).json({
        success: false,
        error: "garmentImageUrl is required",
      });
    }

    const { jobId } = await service.startTryOn({
      modelImageUrl: ANCHOR_MODEL_URL,
      garmentImageUrl,
    });

    return res.json({
      success: true,
      jobId,
    });
  }

  async status(req: Request, res: Response) {
    try {
      const job = await service.pollJob(req.params.jobId);
      return res.json({ success: true, job });
    } catch (e: any) {
      return res.status(404).json({ success: false, error: e.message });
    }
  }
}
