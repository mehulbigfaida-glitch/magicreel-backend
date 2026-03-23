import { Request, Response } from "express";
import { sealLookbook } from "../services/lookbookSeal.service";

export const seal = async (req: Request, res: Response) => {
  try {
    const lookbookId = req.params.lookbookId;

    const result = await sealLookbook(lookbookId);

    res.json({
      success: true,
      lookbook: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
