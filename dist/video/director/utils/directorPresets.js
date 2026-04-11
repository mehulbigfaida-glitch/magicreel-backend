"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectorPreset = exports.DIRECTOR_PRESETS = void 0;
exports.DIRECTOR_PRESETS = {
    cinematic: {
        name: "cinematic",
        fps: 24,
        resolution: "854x480",
        transition: "fade",
        camera: "arc",
    },
    dreamy: {
        name: "dreamy",
        fps: 24,
        resolution: "854x480",
        transition: "fade",
        camera: "slow-pan",
    },
    vogue: {
        name: "vogue",
        fps: 30,
        resolution: "854x480",
        transition: "cut",
        camera: "dolly",
    },
};
const getDirectorPreset = (name) => {
    const key = String(name).toLowerCase();
    return exports.DIRECTOR_PRESETS[key] || null;
};
exports.getDirectorPreset = getDirectorPreset;
