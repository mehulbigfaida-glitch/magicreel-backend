// src/video/director/utils/promptEngine.utils.ts

export interface DirectorPromptInput {
  preset: string;
  durationMs: number;
  cameraPrompt?: string;
  tone?: 'editorial' | 'runway' | 'commercial' | 'luxury' | 'street';
  styleTags?: string[];
  extraDetails?: string;
}

const toSeconds = (ms: number): string => (ms / 1000).toFixed(1);

export const buildDirectorPrompt = (input: DirectorPromptInput): string => {
  const {
    preset,
    durationMs,
    cameraPrompt,
    tone = 'editorial',
    styleTags = [],
    extraDetails,
  } = input;

  const durationSec = toSeconds(durationMs);

  const baseToneMap: Record<string, string> = {
    editorial: 'high-fashion editorial shot, dramatic lighting, magazine cover energy',
    runway: 'dynamic runway walk, spotlight, audience in soft blur, strong stage lighting',
    commercial: 'clean, bright commercial look, product focused, friendly and polished',
    luxury: 'luxury fashion brand visual, rich contrast, elegant composition, premium feel',
    street: 'urban street style, natural movement, ambient city lights, candid energy',
  };

  const toneSnippet = baseToneMap[tone] || baseToneMap.editorial;

  const styleSnippet = styleTags.length
    ? styleTags.join(', ')
    : 'cinematic, 4k, shallow depth of field, smooth motion';

  const camSnippet = cameraPrompt || 'smooth cinematic camera movement, stabilised, natural pacing';

  const extraSnippet = extraDetails ? `, ${extraDetails}` : '';

  return [
    `Fashion video for preset "${preset}", duration ${durationSec} seconds`,
    toneSnippet,
    styleSnippet,
    camSnippet,
    extraSnippet,
  ]
    .filter(Boolean)
    .join(', ');
};
