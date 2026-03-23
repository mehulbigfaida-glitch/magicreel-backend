// src/video/templates/motion/easing.ts

import type { EasingType as CoreEasingType } from "../VideoTemplate";

// Re-export the core easing type so motion templates can import from here
export type EasingType = CoreEasingType;

/**
 * Build a VERY SIMPLE FFmpeg expression for progress in [0, +∞).
 *
 * For now, we IGNORE the easing type and just do linear,
 * so the video engine is stable again.
 *
 * - duration: clip duration in seconds
 * - motionSpeed: multiplier (1 = normal, 2 = faster, 0.5 = slower)
 */
export function easingExpr(
  _easing: EasingType,
  duration: number,
  motionSpeed?: number
): string {
  const speed = !motionSpeed || motionSpeed <= 0 ? 1 : motionSpeed;

  // Base linear progress: t / duration
  const base = `t/${duration}`;

  // If speed != 1, just scale linearly. No commas, no min, no pow.
  return speed === 1 ? base : `${speed}*(${base})`;
}

/**
 * Backwards compatible alias.
 * We STILL ignore the easing name and treat everything as linear.
 */
export function buildEasingFFmpegExpr(
  _easing: string | EasingType,
  duration: number,
  motionSpeed?: number
): string {
  return easingExpr("linear" as EasingType, duration, motionSpeed);
}
