import { Request, Response } from "express";

/**
 * Legacy compatibility endpoint.
 * Publishing is free for all users. Keep the export so older route imports
 * remain build-compatible, but never create a Razorpay order for publishing.
 */
export const createPublishingOrder = async (_req: Request, res: Response) => {
  return res.status(410).json({
    success: false,
    error: "PUBLISHING_IS_FREE",
    message: "Instagram publishing is free. No payment is required.",
  });
};
