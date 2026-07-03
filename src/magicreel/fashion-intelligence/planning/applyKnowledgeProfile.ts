import { CreativePlan } from "./creativePlan.types";
import { DirectorOutput } from "../directors/baseDirector.types";

function mergeText(
  base: string,
  additions: string[]
): string {

  if (!additions.length) {
    return base;
  }

  const extra =
    additions
      .filter(Boolean)
      .join(", ");

  if (!base) {
    return extra;
  }

  return `${base}, ${extra}`;
}

export function applyKnowledgeProfile(
  plan: CreativePlan,
  profile: DirectorOutput
): CreativePlan {

  // --------------------------------------------------
  // Creative Goal
  // --------------------------------------------------

  plan.creativeGoal.visualPriority = [
    ...new Set([
      ...plan.creativeGoal.visualPriority,
      ...profile.visualPriorities,
    ]),
  ];

  // --------------------------------------------------
  // Lighting
  // --------------------------------------------------

  plan.lighting.style =
    mergeText(
      plan.lighting.style,
      profile.lightingDirection
    );

  // --------------------------------------------------
  // Composition
  // --------------------------------------------------

  plan.composition.layout =
    mergeText(
      plan.composition.layout,
      profile.compositionDirection
    );

  // --------------------------------------------------
  // Model Pose
  // --------------------------------------------------

  plan.model.pose =
    mergeText(
      plan.model.pose,
      profile.poseDirection
    );

  // --------------------------------------------------
  // Storytelling
  // --------------------------------------------------

  plan.storytelling.narrative =
    mergeText(
      plan.storytelling.narrative,
      profile.storytellingDirection
    );

  // --------------------------------------------------
  // Emotion
  // --------------------------------------------------

  plan.emotion.emotionalTone =
    mergeText(
      plan.emotion.emotionalTone,
      profile.emotionalDirection
    );

  // --------------------------------------------------
  // Negative Rules
  // --------------------------------------------------

  plan.rules.prohibited = [
    ...new Set([
      ...plan.rules.prohibited,
      ...profile.negativePriorities,
    ]),
  ];

  return plan;
}