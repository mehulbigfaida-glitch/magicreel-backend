// src/video/templates/motion/index.ts

import { zoomInTemplate } from "./zoomIn";
import { zoomOutTemplate } from "./zoomOut";
import { panLeftTemplate } from "./panLeft";
import { panRightTemplate } from "./panRight";
import { tiltUpTemplate } from "./tiltUp";
import { tiltDownTemplate } from "./tiltDown";

export const MotionTemplates: Record<string, any> = {
  zoomIn: zoomInTemplate,
  zoomOut: zoomOutTemplate,
  panLeft: panLeftTemplate,
  panRight: panRightTemplate,
  tiltUp: tiltUpTemplate,
  tiltDown: tiltDownTemplate,
};

export const DEFAULT_MOTION_TEMPLATE = "zoomIn";
