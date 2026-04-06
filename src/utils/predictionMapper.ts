export type PredictionType = 'hero' | 'reel' | 'lookbook';

export interface PredictionViewModel {
  id: string;
  type: PredictionType;

  heroImageUrl?: string;
  reelUrl?: string;
  lookbookImages?: string[];

  createdAt: string;
}

export function mapPrediction(p: any): PredictionViewModel {
  const base = {
    id: p.id,
    createdAt: p.createdAt,
  };

  const isVideo =
    typeof p.mediaUrl === 'string' &&
    (p.mediaUrl.endsWith('.mp4') || p.mediaUrl.includes('/video/'));

  const isLookbook =
    Array.isArray(p.mediaUrls) && p.mediaUrls.length > 1;

  if (isVideo) {
    return {
      ...base,
      type: 'reel',
      reelUrl: p.mediaUrl,
    };
  }

  if (isLookbook) {
    return {
      ...base,
      type: 'lookbook',
      lookbookImages: p.mediaUrls,
    };
  }

  return {
    ...base,
    type: 'hero',
    heroImageUrl: p.mediaUrl,
  };
}