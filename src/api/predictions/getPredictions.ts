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

console.time("creditTx");

const creditTx = await prisma.creditTransaction.findMany({
  where: {
    status: "COMPLETED",
    userId: userId,
  },
  orderBy: { createdAt: "desc" },
});

console.timeEnd("creditTx");

const belongsToUser = (item: any, type: string) => {
  const itemTime = new Date(item.createdAt).getTime();

  const match = creditTx.find((tx: any) => {
    const txTime = new Date(tx.createdAt).getTime();

    const isSameType = tx.feature
      ?.toLowerCase()
      .includes(type.toLowerCase());

    const isCloseInTime = Math.abs(txTime - itemTime) < 15000; // 🔥 15 sec window

    return isSameType && isCloseInTime;
  });

  return !!match;
};

    // ========================
    // STEP 2: GROUP IDs BY TYPE
    // ========================
    

    // ========================
    // STEP 3: FETCH ONLY USER JOBS
    // ========================

    console.time("heroJobs");

// HERO
const heroJobs = await prisma.productToModelJob.findMany({
  orderBy: { createdAt: "desc" },
  take: 50,
});

console.timeEnd("heroJobs");

    console.time("reelJobs");

// REEL
const reelJobs = await prisma.render.findMany({
      where: {
    type: "REEL",
  },
  orderBy: { createdAt: "desc" },
  take: 30,
});

console.log(
  "REEL SAMPLE",
  JSON.stringify(reelJobs[0], null, 2)
);

console.timeEnd("reelJobs");

    console.time("lookbookJobs");

// LOOKBOOK
const lookbookJobs = await prisma.lookbook.findMany({
  orderBy: { createdAt: "desc" },
  take: 50,
});

console.timeEnd("lookbookJobs");

    console.time("allLookbookRenders");

// Fetch all renders in a single query
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

  orderBy: {
    createdAt: "asc",
  },
});

console.timeEnd("allLookbookRenders");

// Group renders by lookbookId
const rendersByLookbook = new Map<string, any[]>();

for (const render of allLookbookRenders) {
  if (!rendersByLookbook.has(render.lookbookId)) {
    rendersByLookbook.set(render.lookbookId, []);
  }

  rendersByLookbook.get(render.lookbookId)!.push(render);
}

// Build lookbook predictions without additional DB queries
const lookbookPredictions = lookbookJobs.map((lb: any) => {
  const renders = rendersByLookbook.get(lb.id) || [];

  const lookbookImages = renders
    .map((r) => r.outputImageUrl)
    .filter((url) => !!url);

  const heroRender = renders.find(
    (r) => r.pose === "hero"
  );

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
      ...heroJobs
  .filter((job) => belongsToUser(job, "hero"))
  .map((job) => ({
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
...reelJobs
  .map((job) => ({
    id: job.id,
    type: "reel",
    status: job.status || "completed",

    TEST_CTO: "HELLO_MEHUL",
    
    mediaUrl: job.reelVideoUrl ?? null,

    // source image used to create reel
    heroImageUrl: job.modelImageUrl ?? null,

    createdAt: job.createdAt,
    creditsUsed: getCredits({
      type: "reel",
      createdAt: job.createdAt,
    }),
  })),

      // LOOKBOOK
...lookbookPredictions
  .map((lb) => ({
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