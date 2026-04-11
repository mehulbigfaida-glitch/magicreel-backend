"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrediction = mapPrediction;
function mapPrediction(p) {
    const base = {
        id: p.id,
        createdAt: p.createdAt,
    };
    // ✅ LOOKBOOK
    if (Array.isArray(p.mediaUrls) && p.mediaUrls.length > 1) {
        return {
            ...base,
            type: 'lookbook',
            lookbookImages: p.mediaUrls,
        };
    }
    // ✅ REEL (PRIMARY FIX)
    if (p.type?.toLowerCase() === 'reel') {
        return {
            ...base,
            type: 'reel',
            reelUrl: p.mediaUrl ?? null, // allows placeholder when null
        };
    }
    // ✅ HERO DEFAULT
    return {
        ...base,
        type: 'hero',
        heroImageUrl: p.mediaUrl ?? null,
    };
}
