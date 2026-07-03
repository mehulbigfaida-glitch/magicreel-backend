import {
  PromptContext,
} from "../fashion-intelligence/types/context.types";

export function buildCampaignContext(
  args: {
    campaignType: string;
    tone: string;
    backgroundStyle: string;
  }
): PromptContext {

  let mood: any =
    "editorial";

  let luxuryTier: any =
    "couture";

  let occasion: any =
    "editorial";

  let campaignType: any =
    "luxury-commercial";

  /* -------------------------
     BACKGROUND STYLE
  ------------------------- */

  if (
    args.backgroundStyle ===
    "Royal Wedding"
  ) {
    mood = "royal";
    occasion = "bridal";
  }

  /* -------------------------
     TONE
  ------------------------- */

  if (
    args.tone === "luxury"
  ) {
    luxuryTier =
      "ultra-luxury";
  }

  /* -------------------------
     CAMPAIGN TYPE
  ------------------------- */

  if (
    args.campaignType ===
    "new-arrival"
  ) {
    campaignType =
      "luxury-commercial";
  }

  return {
    category: "bridal",
    mood,
    luxuryTier,
    occasion,
    campaignType,
  };
}