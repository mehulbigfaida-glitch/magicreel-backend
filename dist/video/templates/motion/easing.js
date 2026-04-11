"use strict";
// src/video/templates/motion/easing.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.easingExpr = easingExpr;
exports.buildEasingFFmpegExpr = buildEasingFFmpegExpr;
/**
 * Build a VERY SIMPLE FFmpeg expression for progress in [0, +∞).
 *
 * For now, we IGNORE the easing type and just do linear,
 * so the video engine is stable again.
 *
 * - duration: clip duration in seconds
 * - motionSpeed: multiplier (1 = normal, 2 = faster, 0.5 = slower)
 */
function easingExpr(_easing, duration, motionSpeed) {
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
function buildEasingFFmpegExpr(_easing, duration, motionSpeed) {
    return easingExpr("linear", duration, motionSpeed);
}
