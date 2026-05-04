import {
  ResolvedCampaignGoal,
  SocialCreativeGoal,
} from "./socialPack.types";

export function resolveCampaignGoal(
  goal: SocialCreativeGoal
): ResolvedCampaignGoal {
  switch (goal) {
    case "lookbook":
      return {
        compositionBehavior: [
          "editorial storytelling composition",
          "premium fashion campaign pacing",
          "luxury visual hierarchy",
          "cinematic lookbook framing",
        ],

        typographyBehavior: [
          "minimal editorial typography",
          "luxury spacing balance",
          "high-fashion text hierarchy",
        ],

        marketingBehavior: [
          "brand storytelling focus",
          "editorial luxury identity",
          "premium campaign consistency",
        ],

        outputIntent:
          "luxury editorial fashion campaign",
      };

    case "instagram":
      return {
        compositionBehavior: [
          "mobile-first visual hierarchy",
          "high attention focal composition",
          "social-first framing behavior",
          "bold visual readability",
        ],

        typographyBehavior: [
          "high-impact text placement",
          "mobile readability optimization",
          "social engagement hierarchy",
        ],

        marketingBehavior: [
          "high engagement marketing behavior",
          "social campaign energy",
          "premium brand visibility",
        ],

        outputIntent:
          "luxury Instagram promotional creative",
      };

    case "tradeshow":
      return {
        compositionBehavior: [
          "large-format exhibition composition",
          "premium spatial branding hierarchy",
          "luxury tradeshow staging",
          "distance-readable visual structure",
        ],

        typographyBehavior: [
          "large-scale branding hierarchy",
          "exhibition-safe typography spacing",
          "premium logo visibility",
        ],

        marketingBehavior: [
          "luxury exhibition presence",
          "brand authority positioning",
          "premium campaign visibility",
        ],

        outputIntent:
          "high-end fashion tradeshow creative",
      };

    case "sale":
      return {
        compositionBehavior: [
          "high-conversion campaign hierarchy",
          "promotional focal structure",
          "luxury commercial balance",
          "premium offer visibility",
        ],

        typographyBehavior: [
          "conversion-focused text hierarchy",
          "offer visibility optimization",
          "luxury promotional spacing",
        ],

        marketingBehavior: [
          "sales campaign optimization",
          "premium conversion positioning",
          "fashion launch energy",
        ],

        outputIntent:
          "luxury sale campaign creative",
      };

    case "reel-cover":
      return {
        compositionBehavior: [
          "vertical cinematic framing",
          "high-drama focal hierarchy",
          "motion anticipation composition",
          "reel-first visual pacing",
        ],

        typographyBehavior: [
          "bold cinematic title placement",
          "mobile-first readability",
          "short-form visual impact",
        ],

        marketingBehavior: [
          "high-retention visual behavior",
          "scroll-stopping composition",
          "cinematic social hook energy",
        ],

        outputIntent:
          "cinematic reel cover creative",
      };

    default:
      return {
        compositionBehavior: [],

        typographyBehavior: [],

        marketingBehavior: [],

        outputIntent:
          "premium fashion creative",
      };
  }
}