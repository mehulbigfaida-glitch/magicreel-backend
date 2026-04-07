export type PredictionType = 'hero' | 'reel' | 'lookbook';

export interface PredictionViewModel {
  id: string;
  type: PredictionType;

  heroImageUrl?: string | null;
  reelUrl?: string | null;
  lookbookImages?: string[];

  createdAt: string;
}

export function mapPrediction(p: any): PredictionViewModel {
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