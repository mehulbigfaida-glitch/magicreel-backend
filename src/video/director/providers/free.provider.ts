// src/video/director/providers/free.provider.ts

import {
  DirectorVideoProvider,
  DirectorVideoParams,
  DirectorVideoResult,
} from "./provider.interface";

/**
 * FreeTestProvider is a stub implementation for the "free" video provider.
 * It satisfies the DirectorVideoProvider interface and returns a placeholder result.
 */
export class FreeTestProvider implements DirectorVideoProvider {
  name: "free" = "free";

  isAvailable(): boolean {
    // Free provider is always available.
    return true;
  }

  async generateVideo(params: DirectorVideoParams): Promise<DirectorVideoResult> {
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
