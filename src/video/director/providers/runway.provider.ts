// src/video/director/providers/runway.provider.ts

import {
  DirectorVideoProvider,
  DirectorVideoParams,
  DirectorVideoResult,
} from "./provider.interface";

export const runwayProvider: DirectorVideoProvider = {
  name: "runway",

  isAvailable() {
    return false; // until API keys configured
  },

  async generateVideo(params: DirectorVideoParams): Promise<DirectorVideoResult> {
    throw new Error("Runway provider not implemented yet.");
  },
};
