import fs from 'fs/promises';
import path from 'path';

export interface GarmentInfo {
  category: 'dress' | 'saree' | 'top' | 'hoodie' | 'bottom' | 'unknown';
  mainColor: string;
  fabricVibe: 'flowy' | 'structured' | 'shiny' | 'unknown';
}

export interface ScenePreset {
  id: string;
  name: string;
  description: string;
  recommendedCategories: string[];
  lighting?: Record<string, unknown>;
  background?: Record<string, unknown>;
  camera?: Record<string, unknown>;
  pose?: Record<string, unknown>;
  motion?: Record<string, unknown>;
}

const SCENES_DIR = path.join(__dirname, '..', 'presets', 'scenes');

async function loadScenePreset(fileName: string): Promise<ScenePreset> {
  const filePath = path.join(SCENES_DIR, fileName);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as ScenePreset;
}

export async function getAllScenePresets(): Promise<ScenePreset[]> {
  const files = await fs.readdir(SCENES_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const presets: ScenePreset[] = [];
  for (const file of jsonFiles) {
    const preset = await loadScenePreset(file);
    presets.push(preset);
  }
  return presets;
}

/**
 * Sprint 1: Simple garment analysis stub.
 * Later this can call a proper vision model or use your Fashn/fabric logic.
 */
export async function analyzeGarment(
  garmentImageUrl: string,
): Promise<GarmentInfo> {
  const lower = (garmentImageUrl || '').toLowerCase();

  let category: GarmentInfo['category'] = 'top';

  if (lower.includes('saree')) category = 'saree';
  else if (lower.includes('dress')) category = 'dress';
  else if (lower.includes('hoodie')) category = 'hoodie';
  else if (lower.includes('jeans') || lower.includes('pant')) category = 'bottom';
  else if (!lower) category = 'unknown';

  return {
    category,
    mainColor: '#cccccc', // placeholder: can be replaced with real color extraction
    fabricVibe: 'unknown',
  };
}

interface GetScenesForGarmentParams {
  garment: GarmentInfo;
  selectedScenes?: string[];
  brand?: {
    name?: string;
    primaryColor?: string;
    vibe?: string;
  };
}

/**
 * Decide which scenes to use based on garment + selected scenes.
 * Sprint 1: Basic rule-based selection from preset metadata.
 */
export async function getScenesForGarment(
  params: GetScenesForGarmentParams,
): Promise<ScenePreset[]> {
  const { garment, selectedScenes = [] } = params;
  const allPresets = await getAllScenePresets();

  // If user manually selected scenes by id or name
  if (selectedScenes.length > 0) {
    const selected = allPresets.filter(
      (preset) =>
        selectedScenes.includes(preset.id) || selectedScenes.includes(preset.name),
    );
    if (selected.length > 0) return selected.slice(0, 5);
  }

  // Auto-pick based on garment category
  const category = garment?.category || 'top';

  let filtered = allPresets.filter((preset) =>
    preset.recommendedCategories.includes(category),
  );

  // Fallback if no matching category
  if (filtered.length === 0) {
    filtered = allPresets;
  }

  // For Sprint 1, just return first 5
  return filtered.slice(0, 5);
}
