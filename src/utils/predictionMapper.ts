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

  // 🔥 PRIORITY 1: LOOKBOOK (STRICT)
  if (p.type === 'lookbook') {
    return {
      ...base,
      type: 'lookbook',
      lookbookImages: Array.isArray(p.mediaUrls)
        ? p.mediaUrls
        : [],
    };
  }

  // 🔥 PRIORITY 2: REEL
  if (p.type === 'reel') {
    return {
      ...base,
      type: 'reel',
      reelUrl: p.mediaUrl ?? null,
    };
  }

  // 🔥 DEFAULT: HERO
  return {
    ...base,
    type: 'hero',
    heroImageUrl: p.mediaUrl ?? null,
  };
}