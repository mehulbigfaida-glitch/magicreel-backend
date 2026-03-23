// src/video/director/providers/provider.registry.ts

import { FreeTestProvider } from "./free.provider";
import { kreaProvider } from "./krea.provider";
import { runwayProvider } from "./runway.provider";

export interface ProviderRegistry {
  [key: string]: any; // Allows dynamic provider lookup
}

export const providerRegistry: ProviderRegistry = {
  free: new FreeTestProvider(),
  krea: kreaProvider,
  runway: runwayProvider,
};

/**
 * Safely get a provider by name.
 * Falls back to the "free" provider if invalid.
 */
export function getProvider(providerName: string) {
  const selected = providerRegistry[providerName];

  if (!selected) {
    console.warn(
      `⚠ Unknown provider "${providerName}", falling back to FREE provider.`
    );
  }

  return selected || providerRegistry["free"];
}
