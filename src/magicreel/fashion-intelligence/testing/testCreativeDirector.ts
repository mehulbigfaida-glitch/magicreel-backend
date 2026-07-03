import { buildCreativePlan } from "../planning/creativePlanBuilder";
import { translateToGPTImagePrompt } from "../translators/gptImageTranslator";
import { PromptContext } from "../types/context.types";

const context: PromptContext = {
  category: "lehenga",

  mood: "editorial",

  campaignType: "couture-editorial",

  luxuryTier: "couture",

  occasion: "bridal",
};

const plan = buildCreativePlan(context);

console.log("========== CREATIVE PLAN ==========\n");

console.dir(plan, { depth: null });

console.log("\n========== GPT IMAGE PROMPT ==========\n");

console.log(
  translateToGPTImagePrompt(plan)
);