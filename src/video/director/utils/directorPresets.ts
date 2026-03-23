export const DIRECTOR_PRESETS: any = {
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

export const getDirectorPreset = (name: string) => {
  const key = String(name).toLowerCase();
  return DIRECTOR_PRESETS[key] || null;
};
