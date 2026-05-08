import {
  EditorialWorld,
} from "./editorialWorldRegistry";

import {
  GarmentAnalysisInput,
  selectEditorialWorld,
} from "./editorialSelector";

export type EditorialDirection = {
  primaryWorld: string;

  emotionalThesis: string;

  visualIdentity: string[];

  lightingDirection: string[];

  poseDirection: string[];

  cameraDirection: string[];

  typographyDirection: string[];

  colorDirection: string[];

  atmosphereDirection: string[];

  restraintRules: string[];

  forbiddenBehaviors: string[];

  secondaryInfluences: string[];
};

export function buildEditorialDirection(
  input: GarmentAnalysisInput
): EditorialDirection {
  const selection = selectEditorialWorld(input);

  const primary = selection.primaryWorld;

  return {
    primaryWorld: primary.label,

    emotionalThesis: primary.emotionalThesis,

    visualIdentity: primary.visualIdentity,

    lightingDirection: primary.lightingGrammar,

    poseDirection: primary.poseGrammar,

    cameraDirection: primary.cameraGrammar,

    typographyDirection: primary.typographyGrammar,

    colorDirection: primary.colorGovernance,

    atmosphereDirection: primary.atmosphereRules,

    restraintRules: primary.restraintRules,

    forbiddenBehaviors: primary.forbiddenBehaviors,

    secondaryInfluences: selection.secondaryWorlds.map(
      (world) => world.label
    ),
  };
}