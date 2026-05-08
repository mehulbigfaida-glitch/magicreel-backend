import { buildEditorialDirection } from "./editorialDirector";

import { GarmentAnalysisInput } from "./editorialSelector";

export type CampaignAssetType =
  | "hero"
  | "instagram-post"
  | "story"
  | "reel"
  | "poster"
  | "website-banner";

export type CampaignAssetDirection = {
  assetType: CampaignAssetType;

  compositionIntent: string;

  framingDirection: string[];

  moodDirection: string[];

  typographyBehavior: string[];

  motionDirection?: string[];
};

export type EditorialCampaignResult = {
  primaryWorld: string;

  emotionalThesis: string;

  assets: CampaignAssetDirection[];
};

export function buildEditorialCampaign(
  input: GarmentAnalysisInput,
  selectedAssets: CampaignAssetType[]
): EditorialCampaignResult {
  const direction = buildEditorialDirection(input);

  const assets: CampaignAssetDirection[] = selectedAssets.map(
    (assetType) => buildAssetDirection(assetType, direction)
  );

  return {
    primaryWorld: direction.primaryWorld,

    emotionalThesis: direction.emotionalThesis,

    assets,
  };
}

function buildAssetDirection(
  assetType: CampaignAssetType,
  direction: ReturnType<typeof buildEditorialDirection>
): CampaignAssetDirection {
  switch (assetType) {
    case "hero":
      return {
        assetType,

        compositionIntent:
          "Primary luxury campaign hero composition.",

        framingDirection: [
          "cinematic hero framing",
          "luxury negative space",
          "editorial balance",
        ],

        moodDirection: direction.atmosphereDirection,

        typographyBehavior: direction.typographyDirection,
      };

    case "instagram-post":
      return {
        assetType,

        compositionIntent:
          "Instagram editorial luxury composition.",

        framingDirection: [
          "social-first editorial crop",
          "high-fashion portrait balance",
          "luxury visual focus",
        ],

        moodDirection: direction.atmosphereDirection,

        typographyBehavior: direction.typographyDirection,
      };

    case "story":
      return {
        assetType,

        compositionIntent:
          "Vertical story-first luxury composition.",

        framingDirection: [
          "vertical cinematic framing",
          "mobile-first composition",
          "story-safe spacing",
        ],

        moodDirection: direction.atmosphereDirection,

        typographyBehavior: direction.typographyDirection,
      };

    case "reel":
      return {
        assetType,

        compositionIntent:
          "Luxury cinematic motion direction.",

        framingDirection: [
          "motion-oriented framing",
          "cinematic pacing",
          "editorial movement balance",
        ],

        moodDirection: direction.atmosphereDirection,

        typographyBehavior: direction.typographyDirection,

        motionDirection: [
          "slow luxury motion",
          "controlled camera movement",
          "fashion editorial pacing",
        ],
      };

    case "poster":
      return {
        assetType,

        compositionIntent:
          "Luxury campaign poster composition.",

        framingDirection: [
          "editorial poster balance",
          "high-end whitespace",
          "luxury print framing",
        ],

        moodDirection: direction.atmosphereDirection,

        typographyBehavior: direction.typographyDirection,
      };

    case "website-banner":
      return {
        assetType,

        compositionIntent:
          "Website hero banner composition.",

        framingDirection: [
          "wide cinematic composition",
          "desktop-safe framing",
          "luxury website spacing",
        ],

        moodDirection: direction.atmosphereDirection,

        typographyBehavior: direction.typographyDirection,
      };

    default:
      throw new Error(`Unsupported asset type: ${assetType}`);
  }
}