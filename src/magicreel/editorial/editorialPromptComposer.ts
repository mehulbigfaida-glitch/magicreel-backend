import { buildEditorialDirection } from "./editorialDirector";

import { GarmentAnalysisInput } from "./editorialSelector";

export type EditorialPromptResult = {
  prompt: string;
};

export function composeEditorialPrompt(
  input: GarmentAnalysisInput
): EditorialPromptResult {
  const direction = buildEditorialDirection(input);

  const sections: string[] = [];

  // PRIMARY DIRECTION
  sections.push(
    `Luxury fashion campaign in the "${direction.primaryWorld}" editorial world.`
  );

  // EMOTIONAL THESIS
  sections.push(direction.emotionalThesis);

  // VISUAL IDENTITY
  sections.push(
    `Visual identity: ${direction.visualIdentity.join(", ")}.`
  );

  // LIGHTING
  sections.push(
    `Lighting direction: ${direction.lightingDirection.join(", ")}.`
  );

  // POSE
  sections.push(
    `Pose direction: ${direction.poseDirection.join(", ")}.`
  );

  // CAMERA
  sections.push(
    `Camera direction: ${direction.cameraDirection.join(", ")}.`
  );

  // TYPOGRAPHY
  sections.push(
    `Typography behavior: ${direction.typographyDirection.join(", ")}.`
  );

  // COLOR
  sections.push(
    `Color governance: ${direction.colorDirection.join(", ")}.`
  );

  // ATMOSPHERE
  sections.push(
    `Atmosphere: ${direction.atmosphereDirection.join(", ")}.`
  );

  // RESTRAINT
  sections.push(
    `Luxury restraint rules: ${direction.restraintRules.join(", ")}.`
  );

  // FORBIDDEN
  sections.push(
    `Avoid: ${direction.forbiddenBehaviors.join(", ")}.`
  );

  // SECONDARY INFLUENCES
  if (direction.secondaryInfluences.length > 0) {
    sections.push(
      `Subtle secondary influences from: ${direction.secondaryInfluences.join(
        ", "
      )}.`
    );
  }

  return {
    prompt: sections.join(" "),
  };
}