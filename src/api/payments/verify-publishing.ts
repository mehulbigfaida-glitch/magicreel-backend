import { Request, Response } from "express";

/**
 * Legacy compatibility endpoint.
 * Publishing no longer has a paid subscription. Do not verify payments or
 * modify publishing subscription dates from this endpoint.
 */
export const verifyPublishing = async (_req: Request, res: Response) => {
  return res.status(410).json({
    success: false,
    error: "PUBLISHING_IS_FREE",
    message: "Instagram publishing is free. No payment is required.",
  });
};
