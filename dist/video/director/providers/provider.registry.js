"use strict";
// src/video/director/providers/provider.registry.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerRegistry = void 0;
exports.getProvider = getProvider;
const free_provider_1 = require("./free.provider");
const krea_provider_1 = require("./krea.provider");
const runway_provider_1 = require("./runway.provider");
exports.providerRegistry = {
    free: new free_provider_1.FreeTestProvider(),
    krea: krea_provider_1.kreaProvider,
    runway: runway_provider_1.runwayProvider,
};
/**
 * Safely get a provider by name.
 * Falls back to the "free" provider if invalid.
 */
function getProvider(providerName) {
    const selected = exports.providerRegistry[providerName];
    if (!selected) {
        console.warn(`⚠ Unknown provider "${providerName}", falling back to FREE provider.`);
    }
    return selected || exports.providerRegistry["free"];
}
