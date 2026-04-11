"use strict";
// src/video/director/providers/free.provider.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreeTestProvider = void 0;
/**
 * FreeTestProvider is a stub implementation for the "free" video provider.
 * It satisfies the DirectorVideoProvider interface and returns a placeholder result.
 */
class FreeTestProvider {
    constructor() {
        this.name = "free";
    }
    isAvailable() {
        // Free provider is always available.
        return true;
    }
    async generateVideo(params) {
        return {
            videoUrl: "https://example.com/free-placeholder-video.mp4",
            provider: "free",
            raw: {
                message: "FreeTestProvider is a placeholder implementation.",
                receivedParams: params,
            },
        };
    }
}
exports.FreeTestProvider = FreeTestProvider;
