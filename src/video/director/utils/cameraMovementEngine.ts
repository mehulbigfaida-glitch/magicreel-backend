// src/video/director/utils/cameraMovementEngine.ts

export type CameraMovementType =
  | 'static'
  | 'dolly-in'
  | 'dolly-out'
  | 'pan-left'
  | 'pan-right'
  | 'orbit-left'
  | 'orbit-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'runway-track';

export interface CameraInstruction {
  movement: CameraMovementType;
  speed: number;
  lensMm: number;
  notes: string;
  promptSnippet: string;
}

export interface CameraPlanInput {
  preset: string;
  sceneIndex: number;
  totalScenes: number;
  durationMs: number;
}

const clamp = (val: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, val));

export const buildCameraInstruction = (input: CameraPlanInput): CameraInstruction => {
  const { preset, sceneIndex, totalScenes, durationMs } = input;

  const isRunway =
    preset.toLowerCase().includes('runway') ||
    preset.toLowerCase().includes('walk');

  const isStudio =
    preset.toLowerCase().includes('studio') ||
    preset.toLowerCase().includes('cyclorama');

  const isStreet =
    preset.toLowerCase().includes('street') ||
    preset.toLowerCase().includes('neon');

  let movement: CameraMovementType = 'static';
  let baseSpeed = 1.0;
  let lensMm = 35;
  let notes = '';

  if (isRunway) {
    movement = 'runway-track';
    baseSpeed = 1.2;
    lensMm = 50;
    notes = 'Track the model along the runway with smooth stabilised motion.';
  } else if (isStudio) {
    const cycle = sceneIndex % 3;
    if (cycle === 0) {
      movement = 'dolly-in';
      notes = 'Slow dolly-in to emphasise the garment details.';
      lensMm = 50;
    } else if (cycle === 1) {
      movement = 'orbit-left';
      notes = 'Soft orbit around the model to show silhouette.';
      lensMm = 35;
    } else {
      movement = 'dolly-out';
      notes = 'Subtle dolly-out to reveal full outfit and environment.';
      lensMm = 28;
    }
  } else if (isStreet) {
    const cycle = sceneIndex % 2;
    movement = cycle === 0 ? 'pan-left' : 'pan-right';
    baseSpeed = 1.1;
    lensMm = 24;
    notes = 'Urban fashion shot with gentle lateral pan to feel dynamic.';
  } else {
    const cycle = sceneIndex % 4;
    if (cycle === 0) movement = 'zoom-in';
    else if (cycle === 1) movement = 'zoom-out';
    else if (cycle === 2) movement = 'orbit-right';
    else movement = 'dolly-in';
    baseSpeed = 1.0;
    lensMm = 35;
    notes = 'Cinematic movement to keep the frame alive.';
  }

  const durationSec = durationMs / 1000;
  const durationFactor = clamp(durationSec / 12, 0.7, 1.4);
  const speed = parseFloat((baseSpeed * durationFactor).toFixed(2));

  const promptSnippet = [
    `camera movement: ${movement}`,
    `speed: ${speed}`,
    `${lensMm}mm lens`,
    `smooth, cinematic, stabilised`,
  ].join(', ');

  return {
    movement,
    speed,
    lensMm,
    notes,
    promptSnippet,
  };
};
