import { Request, Response } from "express";
import prisma from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {
  try {
    const data = await prisma.render.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return res.json(data);
  } catch (error) {
    console.error("❌ Predictions error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch predictions",
    });
  }
};