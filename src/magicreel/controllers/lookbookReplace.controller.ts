import { Request, Response } from "express";
import { replaceLookbookElement } from "../services/lookbookReplace.service";

export const replaceElement = async (req: Request, res: Response) => {
  try {
    const result = await replaceLookbookElement({
      lookbookId: req.params.lookbookId,
      elementType: req.body.elementType,
      elementImageUrl: req.body.elementImageUrl,
    });

    res.json({
      success: true,
      edit: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
