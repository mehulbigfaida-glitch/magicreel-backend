import { Request, Response } from "express";
import { CreateAIService } from "./createAI.service";

const service = new CreateAIService();

export async function generateCreateAI(
  req: Request,
  res: Response
) {
  try {
    const result =
      await service.generate(req.body);

    return res.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error(
      "[CREATE AI ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Generation failed"
    });
  }
}