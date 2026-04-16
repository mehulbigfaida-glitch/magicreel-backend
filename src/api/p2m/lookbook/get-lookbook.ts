import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";

export async function getLookbookById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // ✅ Safety check
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing lookbook id",
      });
    }

    // ✅ Fetch ONLY completed renders
    const renders = await prisma.render.findMany({
      where: {
        lookbookId: id,
        status: "completed",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // ✅ If nothing found
    if (!renders || renders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Lookbook not found",
      });
    }

    // ✅ Normalize output for frontend
    const poses = renders.map((r) => ({
      poseId: r.pose || "UNKNOWN",
      imageUrl: r.outputImageUrl || "",
    }));

    return res.json({
      success: true,
      runId: id,
      poses,
    });

  } catch (error: any) {
    console.error("❌ Fetch Lookbook Error:", error?.message || error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch lookbook",
    });
  }
}