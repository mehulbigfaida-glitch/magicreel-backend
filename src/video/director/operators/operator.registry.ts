// src/video/director/operators/operator.registry.ts

import { DirectorSceneOperator } from "./operator.interface";
import { kreaOperator } from "./krea.operator";
import { runwayOperator } from "./runway.operator";
import { fashnOperator } from "./fashn.operator";

const registry: DirectorSceneOperator[] = [
  kreaOperator,
  runwayOperator,
  fashnOperator,
];

export const getPreferredOperator = (): DirectorSceneOperator => {
  return registry[0];
};

export const getOperatorById = (id: string): DirectorSceneOperator | null => {
  return registry.find((op) => op.id === id) || null;
};
