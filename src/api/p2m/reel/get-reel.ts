import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

export async function getReelById(
  req: Request,
  res: Response
) {
  try {

    const { renderId } = req.params;

    const reel =
      await prisma.render.findUnique({
        where: {
          id: renderId,
        },
      });

    if (!reel) {
      return res.status(404).json({
        success: false,
        error: "Reel not found",
      });
    }

    return res.json({
      success: true,
      reelVideoUrl:
        reel.reelVideoUrl,
      renderId:
        reel.id,
    });

  } catch (error: any) {

    console.error(
      "GET REEL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message,
    });

  }
}