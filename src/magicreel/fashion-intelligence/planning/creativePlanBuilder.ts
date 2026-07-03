import { CreativePlan } from "./creativePlan.types";
import { PromptContext } from "../types/context.types";
import { resolveCreativeDirector } from "./directorRegistry";

import { resolveDirector } from "../resolvers/directorResolver";
import { applyKnowledgeProfile } from "./applyKnowledgeProfile";

import { applyEditorialMinimalPack } from "../packs-v2/editorialMinimal.pack";

import { resolveAccessoryProfile } from "../accessory-intelligence/accessoryResolver";

export function buildCreativePlan(
  context: PromptContext
): CreativePlan {

  // --------------------------------------------------------
  // 1. Editorial Creative Director
  // --------------------------------------------------------

  const creativeDirector =
    resolveCreativeDirector(
      context.category
    );

  const contribution =
    creativeDirector.buildPlan(context);

  // --------------------------------------------------------
  // 2. Accessory Intelligence
  // --------------------------------------------------------

  const accessories =
    resolveAccessoryProfile(
      context.category
    );

  let plan: CreativePlan = {

    metadata: {
      version: "2.0",
      category: context.category,
      campaignType:
        context.campaignType ??
        "couture-editorial",
      outputType: "hero",
    },

    identity:
      contribution.identity!,

    creativeGoal:
      contribution.creativeGoal!,

    camera:
      contribution.camera!,

    lighting:
      contribution.lighting!,

    composition:
      contribution.composition!,

    styling:
      contribution.styling!,

    background:
      contribution.background!,

    accessories: {

  jewellery: accessories.jewellery,

  footwear: accessories.footwear,

  handAccessories: accessories.handAccessories,

  hairStyling: accessories.hairStyling,

  beauty: accessories.beauty,

  luxuryRules: accessories.luxuryRules,

  prohibited: accessories.prohibited,

},

    model:
      contribution.model!,

    emotion:
      contribution.emotion!,

    storytelling:
      contribution.storytelling!,

    quality:
      contribution.quality!,

    packs:
      contribution.packs!,

    rules:
      contribution.rules!,
  };

  // --------------------------------------------------------
  // 3. Fashion Knowledge
  // --------------------------------------------------------

  const profile =
    resolveDirector(
      context.category
    );

  plan =
    applyKnowledgeProfile(
      plan,
      profile
    );

  // --------------------------------------------------------
  // 4. Editorial Packs
  // --------------------------------------------------------

  if (
    plan.packs.recommended.includes(
      "EditorialMinimalPack"
    )
  ) {
    plan =
      applyEditorialMinimalPack(
        plan
      );
  }

  return plan;
}