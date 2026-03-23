import { Request, Response } from "express";
import { exportLookbookReel } from "../services/lookbookExport.service";

export const exportReel = async (req: Request, res: Response) => {
  try {
    const lookbookId = req.params.lookbookId;

    const result = await exportLookbookReel(lookbookId);

    res.json({
      success: true,
      result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
