"use strict";
// src/magicreel/prompts/poseRegistryV1.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSE_REGISTRY_V1 = void 0;
// Canonical MagicReel Pose Registry V1
// Camera-driven pose system for Qwen Multi-Angle
exports.POSE_REGISTRY_V1 = [
    // P1 — Hero (reuse)
    {
        id: "P1",
        name: "Hero",
        source: "HERO_REUSE"
    },
    // P2 — 45° Fashion
    {
        id: "P2",
        name: "45 Degree",
        source: "QWEN",
        rotate_degrees: 30,
        use_wide_angle: false
    },
    // P3 — Bird Eye
    {
        id: "P3",
        name: "Bird Eye",
        source: "QWEN",
        vertical_tilt: -1,
        move_forward: 1,
        use_wide_angle: false
    },
    // P4 — Fashion Angle
    {
        id: "P4",
        name: "Fashion Angle",
        source: "QWEN",
        rotate_degrees: 40,
        use_wide_angle: false
    },
    // P5 — Low Angle
    {
        id: "P5",
        name: "Low Angle",
        source: "QWEN",
        vertical_tilt: 1,
        use_wide_angle: false
    },
    // P6 — Chest Close-up
    {
        id: "P6",
        name: "Chest Close",
        source: "QWEN",
        move_forward: 3,
        use_wide_angle: false
    },
    // P7 — Detail Crop
    {
        id: "P7",
        name: "Detail Crop",
        source: "CROP"
    }
];
