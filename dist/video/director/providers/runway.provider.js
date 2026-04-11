"use strict";
// src/video/director/providers/runway.provider.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.runwayProvider = void 0;
exports.runwayProvider = {
    name: "runway",
    isAvailable() {
        return false; // until API keys configured
    },
    async generateVideo(params) {
        throw new Error("Runway provider not implemented yet.");
    },
};
