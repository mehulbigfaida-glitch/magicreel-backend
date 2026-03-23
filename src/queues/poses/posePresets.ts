export type PoseType = "FRONT" | "THREE_QUARTER" | "WALK";

export interface PosePreset {
  type: PoseType;
  label: string;
  promptHint: string;
  outputFileName: string;
}

export const POSE_PRESETS: PosePreset[] = [
  {
    type: "FRONT",
    label: "Front Facing",
    promptHint: "front-facing catalog pose, standing straight",
    outputFileName: "look_1.png"
  },
  {
    type: "THREE_QUARTER",
    label: "Three Quarter",
    promptHint: "45-degree editorial pose, elegant posture",
    outputFileName: "look_2.png"
  },
  {
    type: "WALK",
    label: "Walking",
    promptHint: "walking pose, subtle motion in fabric",
    outputFileName: "look_3.png"
  }
];
