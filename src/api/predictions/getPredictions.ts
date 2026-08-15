import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPredictions = async (req: Request, res: Response) => {

  console.log("===== GET PREDICTIONS HIT =====");

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

    // ========================
    // STEP 2: GROUP IDs BY TYPE
    // ========================
    

    // ========================
    // STEP 3: FETCH ONLY USER JOBS
    // ========================

    console.time("heroJobs");

// HERO
const heroJobs = await prisma.productToModelJob.findMany({
  where: {
    userId,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 50,
});

console.timeEnd("heroJobs");

    console.time("reelJobs");

// REEL
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
  lookbook: {
    userId,
  },
},

  orderBy: {
    createdAt: "desc",
  },

  take: 30,
});

console.timeEnd("reelJobs");

    console.time("lookbookJobs");

// LOOKBOOK
const lookbookJobs = await prisma.lookbook.findMany({
  where: {
    userId,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 50,
});

console.timeEnd("lookbookJobs");

// ========================
// CAMPAIGN
// ========================

console.time("campaignJobs");

const campaignJobs = await prisma.campaign.findMany({
  where: {
    userId,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 50,
});

console.timeEnd("campaignJobs");

console.log("===== CAMPAIGN JOBS =====");
console.log("Count:", campaignJobs.length);
console.dir(campaignJobs, { depth: null });

// ========================
// EDITORIAL
// ========================

console.time("editorialJobs");

const editorialJobs =
  await prisma.editorialGeneration.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

console.timeEnd("editorialJobs");

console.log("===== EDITORIAL JOBS =====");
console.log("Count:", editorialJobs.length);
console.dir(editorialJobs, { depth: null });

// ========================
// SOCIAL
// ========================

console.time("socialJobs");

const socialJobs =
  await prisma.socialGeneration.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

console.timeEnd("socialJobs");

console.log("===== SOCIAL JOBS =====");
console.log("Count:", socialJobs.length);
console.dir(socialJobs, { depth: null });

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
...reelJobs
  .map((job) => ({
    id: job.id,

    type: "reel",

    status: job.status || "completed",

    mediaUrl: job.reelVideoUrl ?? null,

    // source image used for caption generation
    heroImageUrl: job.modelImageUrl ?? null,

    createdAt: job.createdAt,

    creditsUsed:
      job.pose === "REEL"
        ? 0
        : getCredits({
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

// CAMPAIGN
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

// SOCIAL
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

// EDITORIAL
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