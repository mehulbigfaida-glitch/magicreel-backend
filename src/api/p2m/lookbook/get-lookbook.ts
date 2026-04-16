import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

export async function getLookbookById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing lookbook id" });
    }

    const renders = await prisma.render.findMany({
      where: { lookbookId: id },
      orderBy: { createdAt: "asc" },
    });

    if (!renders.length) {
      return res.status(404).json({ error: "Lookbook not found" });
    }

    const poses = renders.map((r) => ({
      poseId: r.pose,
      imageUrl: r.outputImageUrl,
    }));

    return res.json({
      success: true,
      runId: id,
      poses,
    });

  } catch (error) {
    console.error("❌ Fetch Lookbook Error:", error);
    return res.status(500).json({ error: "Failed to fetch lookbook" });
  }
}