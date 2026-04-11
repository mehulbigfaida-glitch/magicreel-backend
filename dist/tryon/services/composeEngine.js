"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runComposeEngine = runComposeEngine;
require("dotenv/config");
const replicate_1 = __importDefault(require("replicate"));
const replicate = new replicate_1.default({
    auth: process.env.REPLICATE_API_TOKEN,
});
async function runComposeEngine({ faceImageUrl, garmentImageUrl, }) {
    const prompt = `
High-end Indian fashion catalog photoshoot.
The model is wearing the exact ethnic garment shown.
The garment is full length with natural elegant flare and hem preserved.
Studio lighting, ultra realistic.
`;
    const output = await replicate.run("playgroundai/playground-v2.5", {
        input: {
            prompt,
            image: garmentImageUrl,
            strength: 0.85,
            guidance_scale: 6,
            num_inference_steps: 30,
        },
    });
    const finalImageUrl = Array.isArray(output) ? output[0] : output;
    return {
        finalImageUrl,
        engine: "compose",
        source: "replicate",
        model: "playgroundai/playground-v2.5",
    };
}
