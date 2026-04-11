"use strict";
// src/magicreel/prompts/lookbookPrompt.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLookbookPrompt = buildLookbookPrompt;
const poseRegistryV1_1 = require("./poseRegistryV1");
/**
 * Builds a single-line prompt for a specific lookbook pose.
 * Only used for FASHN-generated poses.
 */
function buildLookbookPrompt(input) {
    const { basePrompt, poseId } = input;
    const pose = poseRegistryV1_1.POSE_REGISTRY_V1.find((p) => p.id === poseId);
    if (!pose) {
        throw new Error(`Invalid poseId: ${poseId}`);
    }
    if (pose.source !== "FASHN") {
        throw new Error(`Pose ${poseId} is not a FASHN-generated pose and should not use prompt generation`);
    }
    if (!pose.promptModifier) {
        throw new Error(`Pose ${poseId} missing promptModifier`);
    }
    // Append pose modifier
    const promptWithPose = `${basePrompt}, ${pose.promptModifier}`;
    // FASHN requires single-line prompts
    return promptWithPose.replace(/\s+/g, " ").trim();
}
