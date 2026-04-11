"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllScenePresets = getAllScenePresets;
exports.analyzeGarment = analyzeGarment;
exports.getScenesForGarment = getScenesForGarment;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const SCENES_DIR = path_1.default.join(__dirname, '..', 'presets', 'scenes');
async function loadScenePreset(fileName) {
    const filePath = path_1.default.join(SCENES_DIR, fileName);
    const raw = await promises_1.default.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
}
async function getAllScenePresets() {
    const files = await promises_1.default.readdir(SCENES_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));
    const presets = [];
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
async function analyzeGarment(garmentImageUrl) {
    const lower = (garmentImageUrl || '').toLowerCase();
    let category = 'top';
    if (lower.includes('saree'))
        category = 'saree';
    else if (lower.includes('dress'))
        category = 'dress';
    else if (lower.includes('hoodie'))
        category = 'hoodie';
    else if (lower.includes('jeans') || lower.includes('pant'))
        category = 'bottom';
    else if (!lower)
        category = 'unknown';
    return {
        category,
        mainColor: '#cccccc', // placeholder: can be replaced with real color extraction
        fabricVibe: 'unknown',
    };
}
/**
 * Decide which scenes to use based on garment + selected scenes.
 * Sprint 1: Basic rule-based selection from preset metadata.
 */
async function getScenesForGarment(params) {
    const { garment, selectedScenes = [] } = params;
    const allPresets = await getAllScenePresets();
    // If user manually selected scenes by id or name
    if (selectedScenes.length > 0) {
        const selected = allPresets.filter((preset) => selectedScenes.includes(preset.id) || selectedScenes.includes(preset.name));
        if (selected.length > 0)
            return selected.slice(0, 5);
    }
    // Auto-pick based on garment category
    const category = garment?.category || 'top';
    let filtered = allPresets.filter((preset) => preset.recommendedCategories.includes(category));
    // Fallback if no matching category
    if (filtered.length === 0) {
        filtered = allPresets;
    }
    // For Sprint 1, just return first 5
    return filtered.slice(0, 5);
}
