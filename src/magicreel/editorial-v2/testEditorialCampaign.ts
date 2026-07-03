import "dotenv/config";

console.log("FAL_KEY:", process.env.FAL_KEY);

import { generateEditorialCampaign } from "./editorialCampaign.service";

async function main() {
  const image = await generateEditorialCampaign({
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

  console.log("\n=================================");
  console.log("EDITORIAL IMAGE");
  console.log(image);
}

main().catch(console.error);