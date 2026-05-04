import {
  composeCinematicPromptV7,
} from "../orchestration/cinematicComposerV7";

const result =
  composeCinematicPromptV7({
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