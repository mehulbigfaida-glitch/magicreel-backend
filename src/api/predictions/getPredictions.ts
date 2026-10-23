import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

type CreditTransactionLite = {
  feature: string | null;
  predictionId: string | null;
  credits: number;
  createdAt: Date;
};

export const getPredictions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const creditTx = (await prisma.creditTransaction.findMany({
      where: { status: "COMPLETED", userId },
      select: { feature: true, predictionId: true, credits: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })) as CreditTransactionLite[];

    const reel360RunIds = creditTx
      .filter((tx) => tx.feature?.toLowerCase() === "reel" && !!tx.predictionId)
      .map((tx) => tx.predictionId as string);

    const [reel360Jobs, heroJobs, reelJobs, lookbookJobs, campaignJobs, editorialJobs, socialJobs] =
      await Promise.all([
        reel360RunIds.length
          ? (prisma as any).reelJob.findMany({
              where: { id: { in: reel360RunIds } },
              orderBy: { createdAt: "desc" },
            })
          : [],
        prisma.productToModelJob.findMany({
          where: { userId },
          select: { id: true, status: true, resultImageUrl: true, avatarGender: true, categoryKey: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.render.findMany({
          select: { id: true, pose: true, type: true, status: true, reelVideoUrl: true, modelImageUrl: true, createdAt: true },
          where: { type: "REEL", pose: { not: "REEL_360" }, lookbook: { userId } },
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
        prisma.lookbook.findMany({
          where: { userId },
          select: { id: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.campaign.findMany({
          where: { userId },
          select: { id: true, status: true, outputImageUrl: true, heroImageUrl: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.editorialGeneration.findMany({
          where: { userId },
          select: { id: true, status: true, imageUrl: true, heroImageUrl: true, editorialWorld: true, output: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.socialGeneration.findMany({
          where: { userId },
          select: { id: true, status: true, imageUrl: true, heroImageUrl: true, creativeGoal: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ]);

    const allLookbookRenders = lookbookJobs.length
      ? await prisma.render.findMany({
          select: { lookbookId: true, pose: true, outputImageUrl: true, createdAt: true },
          where: { lookbookId: { in: lookbookJobs.map((lb) => lb.id) } },
          orderBy: { createdAt: "asc" },
        })
      : [];

    const rendersByLookbook = new Map<string, any[]>();
    for (const render of allLookbookRenders) {
      const renders = rendersByLookbook.get(render.lookbookId) || [];
      renders.push(render);
      rendersByLookbook.set(render.lookbookId, renders);
    }

    const lookbookPredictions = lookbookJobs.map((lb: any) => {
      const renders = rendersByLookbook.get(lb.id) || [];
      const lookbookImages = renders.map((r) => r.outputImageUrl).filter(Boolean);
      const heroRender = renders.find((r) => r.pose === "hero");
      return {
        id: lb.id,
        type: "lookbook",
        status: "completed",
        heroImageUrl: heroRender?.outputImageUrl || lookbookImages[0] || "https://via.placeholder.com/300x450?text=Lookbook",
        lookbookImages,
        createdAt: lb.createdAt,
      };
    });

    // Prefer the exact prediction/job link saved by billing. Timestamp-nearest
    // matching can attach another generation's debit to this card.
    const creditsByPredictionId = new Map<string, number>();
    for (const tx of creditTx) {
      if (tx.predictionId && !creditsByPredictionId.has(tx.predictionId)) {
        creditsByPredictionId.set(tx.predictionId, tx.credits);
      }
    }

    const getCredits = (item: { id: string; type: string; createdAt: Date }) => {
      const exact = creditsByPredictionId.get(item.id);
      if (exact !== undefined) return exact;
      const feature = item.type.toLowerCase();
      const candidates = creditTx.filter((tx) => {
        const txFeature = tx.feature?.toLowerCase() || "";
        const matches = feature === "hero" ? txFeature.includes("hero") :
          feature === "reel" ? txFeature.includes("reel") :
          feature === "lookbook" ? txFeature.includes("lookbook") :
          txFeature.includes(feature);
        return matches && !tx.predictionId;
      });
      if (!candidates.length) return 0;
      const target = new Date(item.createdAt).getTime();
      return candidates.reduce((nearest, tx) =>
        Math.abs(tx.createdAt.getTime() - target) < Math.abs(nearest.createdAt.getTime() - target) ? tx : nearest
      ).credits;
    };

    const predictions = [
      ...heroJobs.map((job) => ({ id: job.id, type: "hero", status: job.status, mediaUrl: job.resultImageUrl, avatarGender: job.avatarGender, categoryKey: job.categoryKey, createdAt: job.createdAt, creditsUsed: getCredits({ id: job.id, type: "hero", createdAt: job.createdAt }) })),
      ...reelJobs.map((job) => ({ id: job.id, type: "reel", reelType: "standard", status: job.status || "completed", mediaUrl: job.reelVideoUrl ?? null, heroImageUrl: job.modelImageUrl ?? null, createdAt: job.createdAt, creditsUsed: getCredits({ id: job.id, type: "reel", createdAt: job.createdAt }) })),
      ...reel360Jobs.map((job: any) => ({ id: job.id, runId: job.id, type: "reel", reelType: "360", status: job.status || "processing", mediaUrl: job.reelVideoUrl ?? null, heroImageUrl: job.inputImageUrl ?? null, createdAt: job.createdAt, creditsUsed: getCredits({ id: job.id, type: "reel", createdAt: job.createdAt }) })),
      ...lookbookPredictions.map((lb) => ({ ...lb, creditsUsed: getCredits({ id: lb.id, type: "lookbook", createdAt: lb.createdAt }) })),
      ...campaignJobs.map((job) => ({ id: job.id, type: "campaign", status: job.status || "completed", mediaUrl: job.outputImageUrl, heroImageUrl: job.heroImageUrl, createdAt: job.createdAt, creditsUsed: getCredits({ id: job.id, type: "campaign", createdAt: job.createdAt }) })),
      ...socialJobs.map((job) => ({ id: job.id, type: "social", status: job.status || "completed", mediaUrl: job.imageUrl, heroImageUrl: job.heroImageUrl, creativeGoal: job.creativeGoal, createdAt: job.createdAt, creditsUsed: getCredits({ id: job.id, type: "social", createdAt: job.createdAt }) })),
      ...editorialJobs.map((job) => ({ id: job.id, type: "editorial", status: job.status || "completed", mediaUrl: job.imageUrl, heroImageUrl: job.heroImageUrl, editorialWorld: job.editorialWorld, output: job.output, createdAt: job.createdAt, creditsUsed: getCredits({ id: job.id, type: "editorial", createdAt: job.createdAt }) })),
    ];

    predictions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(predictions);
  } catch (error) {
    console.error("❌ Predictions error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch predictions" });
  }
};
