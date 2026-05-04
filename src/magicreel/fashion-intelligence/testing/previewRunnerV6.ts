import {
  composeCinematicPromptV6,
} from "../orchestration/cinematicComposerV6";

const result =
  composeCinematicPromptV6({
    category: "lehenga",

    mood: "royal",

    occasion: "bridal",

    campaignType:
      "bridal-campaign",

    luxuryTier:
      "ultra-luxury",
  });

console.log(
  JSON.stringify(result, null, 2)
);