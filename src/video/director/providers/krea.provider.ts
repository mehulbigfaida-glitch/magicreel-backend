// src/video/director/providers/krea.provider.ts

import {
  DirectorVideoProvider,
  DirectorVideoParams,
  DirectorVideoResult,
} from "./provider.interface";

const KREA_API_KEY = process.env.KREA_API_KEY;
const KREA_API_URL = process.env.KREA_API_URL || "https://api.krea.ai/v1";

/**
 * This provider is an OBJECT, not a class.
 * We export it directly.
 */
export const kreaProvider: DirectorVideoProvider = {
  name: "krea",

  isAvailable(): boolean {
    return Boolean(KREA_API_KEY);
  },

  async generateVideo(params: DirectorVideoParams): Promise<DirectorVideoResult> {
    // Not implemented yet—placeholder.
    throw new Error(
      "Krea provider is not implemented yet. Add KREA_API_KEY and implement the HTTP call."
    );
  },
};
