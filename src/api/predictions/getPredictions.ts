import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ========================
    // STEP 1: GET USER CREDIT TX
    // ========================
    const creditTx = await prisma.creditTransaction.findMany({
      where: {
        userId: userId,
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
    });

    // ========================
    // STEP 2: GROUP IDs BY TYPE
    // ========================
    const heroIds = creditTx
      .filter((tx: any) => tx.feature === "HERO")
      .map((tx: any) => tx.prediction_id);

    const reelIds = creditTx
      .filter((tx: any) => tx.feature === "REEL")
      .map((tx: any) => tx.prediction_id);

    const lookbookIds = creditTx
      .filter((tx: any) => tx.feature === "LOOKBOOK")
      .map((tx: any) => tx.prediction_id);

    // ========================
    // STEP 3: FETCH ONLY USER JOBS
    // ========================

    // HERO
    const heroJobs = await prisma.productToModelJob.findMany({
      where: {
        id: { in: heroIds },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // REEL
    const reelJobs = await prisma.render.findMany({
      where: {
        id: { in: reelIds },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // LOOKBOOK
    const lookbookJobs = await prisma.lookbook.findMany({
      where: {
        id: { in: lookbookIds },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const lookbookPredictions = await Promise.all(
      lookbookJobs.map(async (lb: any) => {
        const renders = await prisma.render.findMany({
          where: {
            lookbookId: lb.id,
          },
          orderBy: { createdAt: "asc" },
        });

        const lookbookImages = renders
          .map((r) => r.outputImageUrl)
          .filter((url) => !!url);

        const heroImageUrl =
          lb.inputImageUrl ||
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
      })
    );

    // ========================
    // CREDIT MATCH FUNCTION
    // ========================
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

    // ========================
    // BUILD RESPONSE
    // ========================
    const predictions = [
      // HERO
      ...heroJobs.map((job) => ({
        id: job.id,
        type: "hero",
        status: job.status,
        mediaUrl: job.resultImageUrl,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "hero",
          createdAt: job.createdAt,
        }),
      })),

      // REEL
      ...reelJobs.map((job) => ({
        id: job.id,
        type: "reel",
        status: job.status || "completed",
        mediaUrl: job.reelVideoUrl ?? null,
        createdAt: job.createdAt,
        creditsUsed: getCredits({
          type: "reel",
          createdAt: job.createdAt,
        }),
      })),

      // LOOKBOOK
      ...lookbookPredictions.map((lb) => ({
        ...lb,
        creditsUsed: getCredits({
          type: "lookbook",
          createdAt: lb.createdAt,
        }),
      })),
    ];

    // SORT
    predictions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
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