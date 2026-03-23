// src/video/templates/index.ts

// Re-export individual motion templates from the motion folder
export { zoomInTemplate } from "./motion/zoomIn";
export { zoomOutTemplate } from "./motion/zoomOut";

export { panLeftTemplate } from "./motion/panLeft";
export { panRightTemplate } from "./motion/panRight";

export { tiltUpTemplate } from "./motion/tiltUp";
export { tiltDownTemplate } from "./motion/tiltDown";

export { slideDiagonalUpTemplate } from "./motion/slideDiagonalUp";
export { slideDiagonalDownTemplate } from "./motion/slideDiagonalDown";

export { rotateLeftTemplate } from "./motion/rotateLeft";
export { rotateRightTemplate } from "./motion/rotateRight";

export { shakeTemplate } from "./motion/shake";

export { parallaxHorizontalTemplate } from "./motion/parallaxHorizontal";
export { parallaxVerticalTemplate } from "./motion/parallaxVertical";

// Also re-export the MotionTemplates map and default from motion/index
export { MotionTemplates, DEFAULT_MOTION_TEMPLATE } from "./motion";
