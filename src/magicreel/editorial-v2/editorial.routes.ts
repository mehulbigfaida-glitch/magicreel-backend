import { Router } from "express";
import { generateEditorialCampaign } from "./editorialCampaign.service";

const router = Router();

router.post("/test", async (req, res) => {
  try {
    const imageUrl = await generateEditorialCampaign({
      heroImageUrl:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1779378423/magicreel/heroes/poeqtlerzgwqaba0qi2b.png",

      context: {
        category: "lehenga",
        mood: "editorial",
        campaignType: "couture-editorial",
        luxuryTier: "couture",
        occasion: "bridal",
      },
    });

    res.json({
      success: true,
      imageUrl,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
});

export default router;