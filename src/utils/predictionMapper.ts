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

  // 🎥 REEL
  const isVideo =
    typeof p.mediaUrl === 'string' &&
    (p.mediaUrl.endsWith('.mp4') || p.mediaUrl.includes('/video/'));

  if (isVideo) {
    return {
      ...base,
      type: 'reel',
      reelUrl: p.mediaUrl,
    };
  }

  // 📚 LOOKBOOK (🔥 FIXED LOGIC)
  if (p.type === 'lookbook') {
    return {
      ...base,
      type: 'lookbook',
      lookbookImages: Array.isArray(p.mediaUrls) ? p.mediaUrls : [],
    };
  }

  // 🖼 HERO (fallback)
  return {
    ...base,
    type: 'hero',
    heroImageUrl: p.mediaUrl,
  };
}