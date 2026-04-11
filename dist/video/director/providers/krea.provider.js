"use strict";
// src/video/director/providers/krea.provider.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.kreaProvider = void 0;
const KREA_API_KEY = process.env.KREA_API_KEY;
const KREA_API_URL = process.env.KREA_API_URL || "https://api.krea.ai/v1";
/**
 * This provider is an OBJECT, not a class.
 * We export it directly.
 */
exports.kreaProvider = {
    name: "krea",
    isAvailable() {
        return Boolean(KREA_API_KEY);
    },
    async generateVideo(params) {
        // Not implemented yet—placeholder.
        throw new Error("Krea provider is not implemented yet. Add KREA_API_KEY and implement the HTTP call.");
    },
};
