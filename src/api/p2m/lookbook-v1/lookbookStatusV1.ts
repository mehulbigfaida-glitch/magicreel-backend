import { Request, Response } from "express";

import { prisma } from "../../../magicreel/db/prisma";
import { supabase } from "../../../lib/supabase";

export async function getLookbookStatusV1(req: Request, res: Response) {
  try {
    const runId = String(req.params.id || "");
    const userId = (req as any).user?.id;

    if (!runId) return res.status(400).json({ error: "runId required" });
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const lookbook = await prisma.lookbook.findFirst({
      where: { id: runId, userId },
      select: { id: true, status: true, presetId: true },
    });

    if (!lookbook) return res.status(404).json({ error: "Lookbook not found" });

    const renders = await prisma.render.findMany({
      where: { lookbookId: runId, status: "completed" },
      select: { id: true, pose: true, outputImageUrl: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    let shareId: string | null = null;
    let aspectRatio: string | null = null;

    const { data: shareRows, error: shareError } = await supabase
      .from("share_assets")
      .select("id, metadata")
      .eq("type", "lookbook")
      .eq("metadata->>runId", runId)
      .limit(1);

    if (!shareError && shareRows?.length) {
      shareId = shareRows[0].id;
      const metadata = shareRows[0].metadata as Record<string, any> | null;
      aspectRatio = metadata?.aspectRatio || null;
    }

    return res.json({
      success: true,
      runId,
      status: lookbook.status,
      poses: renders.map((render) => ({
        poseId: render.pose,
        imageUrl: render.outputImageUrl || undefined,
      })),
      completedCount: renders.length,
      shareId,
      aspectRatio,
    });
  } catch (error: any) {
    console.error("❌ LOOKBOOK V1 STATUS FAILED", error);
    return res.status(500).json({ error: "Unable to fetch Lookbook status" });
  }
}
