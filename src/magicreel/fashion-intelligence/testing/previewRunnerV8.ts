import {
  composeCinematicPromptV8,
} from "../orchestration/cinematicComposerV8";

const result =
  composeCinematicPromptV8({
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