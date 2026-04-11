"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyVignette = applyVignette;
exports.applyGrain = applyGrain;
// src/services/editorial/engines/filtersEngine.ts
const sharp_1 = __importDefault(require("sharp"));
/**
 * For now, we keep filters VERY SAFE and minimal so that nothing breaks.
 * Later we can upgrade effects, but right now no sharp({ create }) with bad channels.
 */
async function applyVignette(inputBuffer, _width, _height) {
    // Minimal "soft darken" to simulate mood – but super safe.
    return (0, sharp_1.default)(inputBuffer).modulate({ brightness: 0.98 }).toBuffer();
}
async function applyGrain(inputBuffer) {
    // No-op for now – return original buffer to avoid noise-generation complexity.
    return inputBuffer;
}
