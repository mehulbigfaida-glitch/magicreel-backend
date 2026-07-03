import { CreativePlan } from "../planning/creativePlan.types";

export function applyEditorialMinimalPack(
  plan: CreativePlan
): CreativePlan {

  // -----------------------------------------
  // Editorial refinement only.
  // Never override creative direction.
  // -----------------------------------------

  if (!plan.lighting.style.includes("editorial")) {

    plan.lighting.style +=
      ", soft editorial refinement";

  }

  if (!plan.lighting.contrast.includes("cinematic")) {

    plan.lighting.contrast +=
      ", gentle cinematic refinement";

  }

  if (!plan.composition.balance.includes("negative")) {

    plan.composition.balance +=
      ", elegant negative space";

  }

  return plan;
}