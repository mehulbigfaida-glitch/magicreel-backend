import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {
  console.log("===== GET PREDICTIONS HIT =====");

  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.time("creditTx");

    const creditTx = await prisma.creditTransaction.findMany({
      where: {
        status: "COMPLETED",
        userId,
      },
      orderBy: { createdAt: "desc" },
    });

    console.timeEnd("creditTx");

    // 360° Reels are persisted in ReelJob using the FAL runId. The billing
    // transaction stores that same runId as predictionId, which gives us a
    // user-scoped link between the Portfolio item and its 360° output route.
    const reel360RunIds = creditTx
      .filter(
        (tx: any) =>
          tx.feature?.toLowerCase() === "reel" &&
          !!tx.predictionId
      )
      .map((tx: any) => tx.predictionId as string);

    console.time("reel360Jobs");

    const reel360Jobs = reel360RunIds.length
      ? await (prisma as any).reelJob.findMany({
          where: {
            id: {
              in: reel360RunIds,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : [];

    console.timeEnd("reel360Jobs");

    console.time("heroJobs");

    const heroJobs = await prisma.productToModelJob.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    console.timeEnd("heroJobs");

    console.time("reelJobs");

    // 360° renders are excluded because their Portfolio representation comes
    // from ReelJob above. This prevents duplicate 360° cards.
    const reelJobs = await prisma.render.findMany({
      select: {
        id: true,
        pose: true,
        type: true,
        status: true,
        reelVideoUrl: true,
        modelImageUrl: true,
        createdAt: true,
      },
      where: {
        type: "REEL",
        pose: { not: "REEL_360" },
        lookbook: { userId },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    console.timeEnd("reelJobs");

    console.time("lookbookJobs");

    const lookbookJobs = await prisma.lookbook.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    console.timeEnd("lookbookJobs");

    console.time("campaignJobs");

    const campaignJobs = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    console.timeEnd("campaignJobs");

    console.log("===== CAMPAIGN JOBS =====");
    console.log("Count:", campaignJobs.length);
    console.dir(campaignJobs, { depth: null });

    console.time("editorialJobs");

    const editorialJobs = await prisma.editorialGeneration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    console.timeEnd("editorialJobs");

    console.log("===== EDITORIAL JOBS =====");
    console.log("Count:", editorialJobs.length);
    console.dir(editorialJobs, { depth: null });

    console.time("socialJobs");

    const socialJobs = await prisma.socialGeneration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    console.timeEnd("socialJobs");

    console.log("===== SOCIAL JOBS =====");
    console.log("Count:", socialJobs.length);
    console.dir(socialJobs, { depth: null });

    console.time("allLookbookRenders");

    const allLookbookRenders = await prisma.render.findMany({
      select: {
        lookbookId: true,
        pose: true,
        outputImageUrl: true,
        createdAt: true,
      },
      where: {
        lookbookId: {
          in: lookbookJobs.map((lb) => lb.id),
        },
      },
      orderBy: { createdAt: "asc" },
    });

    console.timeEnd("allLookbookRenders");

    const rendersByLookbook = new Map<string, any[]>();

    for (const render of allLookbookRenders) {
      if (!rendersByLookbook.has(render.lookbookId)) {
        rendersByLookbook.set(render.lookbookId, []);
      }

      rendersByLookbook.get(render.lookbookId)!.push(render);
    }

    const lookbookPredictions = lookbookJobs.map((lb: any) => {
      const renders = rendersByLookbook.get(lb.id) || [];

      const lookbookImages = renders
        .map((r) => r.outputImageUrl)
        .filter((url) => !!url);

      const heroRender = renders.find((r) => r.pose === "hero");

      const heroImageUrl =
        heroRender?.outputImageUrl ||
        lookbookImages[0] ||
        "https://via.placeholder.com/300x450?text=Lookbook";

      return {
        id: lb.id,
        type: "lookbook",
        status: "completed",
        heroImageUrl,
        lookbookImages,
        createdAt: lb.createdAt,
      };
    });

    const getCredits = (item: any) => {
      const itemTime = new Date(item.createdAt).getTime();

      const match = creditTx
        .filter((tx: any) =>
          tx.feature?.toLowerCase().includes(item.type.toLowerCase())
        )
        .sort(
          (a: any, b: any) =>
            Math.abs(new Date(a.createdAt).getTime() - itemTime) -
            Math.abs(new Date(b.createdAt).getTime() - itemTime)
        )[0];

      return match?.credits ?? 0;
    };

    const predictions = [
      ...heroJobs.map((job) => ({
        id: job.id,
        type: "hero",
        status: job.status,
        mediaUrl: job.resultImageUrl,
        avatarGender: job.avatarGender,
        categoryKey: job.categoryKey,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "hero",
          createdAt: job.createdAt,
        }),
      })),

      ...reelJobs.map((job) => ({
        id: job.id,
        type: "reel",
        reelType: "standard",
        status: job.status || "completed",
        mediaUrl: job.reelVideoUrl ?? null,
        heroImageUrl: job.modelImageUrl ?? null,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "reel",
          createdAt: job.createdAt,
        }),
      })),

      ...reel360Jobs.map((job: any) => ({
        id: job.id,
        runId: job.id,
        type: "reel",
        reelType: "360",
        status: job.status || "processing",
        mediaUrl: job.reelVideoUrl ?? null,
        heroImageUrl: job.inputImageUrl ?? null,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "reel",
          createdAt: job.createdAt,
        }),
      })),

      ...lookbookPredictions.map((lb) => ({
        ...lb,
        creditsUsed: getCredits({
          type: "lookbook",
          createdAt: lb.createdAt,
        }),
      })),

      ...campaignJobs.map((job) => ({
        id: job.id,
        type: "campaign",
        status: job.status || "completed",
        mediaUrl: job.outputImageUrl,
        heroImageUrl: job.heroImageUrl,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "campaign",
          createdAt: job.createdAt,
        }),
      })),

      ...socialJobs.map((job) => ({
        id: job.id,
        type: "social",
        status: job.status || "completed",
        mediaUrl: job.imageUrl,
        heroImageUrl: job.heroImageUrl,
        creativeGoal: job.creativeGoal,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "social",
          createdAt: job.createdAt,
        }),
      })),

      ...editorialJobs.map((job) => ({
        id: job.id,
        type: "editorial",
        status: job.status || "completed",
        mediaUrl: job.imageUrl,
        heroImageUrl: job.heroImageUrl,
        editorialWorld: job.editorialWorld,
        output: job.output,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "editorial",
          createdAt: job.createdAt,
        }),
      })),
    ];

    predictions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    console.log(
      JSON.stringify(
        predictions.find((p: any) => p.type === "reel"),
        null,
        2
      )
    );

    return res.json(predictions);
  } catch (error) {
    console.error("❌ Predictions error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch predictions",
    });
  }
};