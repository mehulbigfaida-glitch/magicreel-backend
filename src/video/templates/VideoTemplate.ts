// src/video/templates/VideoTemplate.ts

/**
 * Core easing types (kept for compatibility with easing.ts).
 * Our current motion templates (zoomIn, pan, tilt) don't depend on these,
 * but other future templates or easing.ts might.
 */
export type EasingType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic";

/**
 * Options that can be passed into any motion template.
 * Most of our simple templates only use durationSeconds (and sometimes fps).
 */
export interface TemplateRenderOptions {
  durationSeconds?: number;
  easing?: EasingType | string;
  motionSpeed?: number;
  fps?: number;
  // allow future options without TS errors
  [key: string]: any;
}

/**
 * Render context passed to each template.
 */
export interface TemplateRenderContext {
  imagePath: string;
  outputPath: string;
  options?: TemplateRenderOptions;
}

/**
 * Every motion template (zoomIn, zoomOut, panLeft, etc.)
 * must implement this interface.
 */
export interface VideoTemplateDefinition {
  id: string;
  label: string;
  description?: string;
  render(ctx: TemplateRenderContext): Promise<void>;
}
