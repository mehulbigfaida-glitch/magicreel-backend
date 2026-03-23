/* =========================================================
   MAGICREEL BACKEND JOB SCHEMA — V1
   Authoritative system backbone
   ========================================================= */

export type ModelId = "riya";

export type PoseId =
  | "front"
  | "three_quarter"
  | "side"
  | "back";

export type LookbookPresetId =
  | "ecommerce_standard"
  | "quick_catalog"
  | "social_reel"
  | "ethnic_pro";

export type RenderEngine = "fashn";

export type JobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type LookbookStatus =
  | "created"
  | "processing"
  | "completed"
  | "partial"
  | "failed";

/* =========================================================
   GARMENT
   ========================================================= */

export interface Garment {
  garmentId: string;
  frontImageUrl: string;
  backImageUrl?: string;
  detailImageUrls?: string[];
  category: "auto" | "top" | "bottom" | "dress" | "ethnic";
  validated: boolean;
  createdAt: string;
}

/* =========================================================
   MODEL
   ========================================================= */

export interface Model {
  modelId: ModelId;
  displayName: string;
  basePoseImages: Record<PoseId, string>;
}

/* =========================================================
   RENDER JOB (ONE POSE = ONE JOB)
   ========================================================= */

export interface RenderJob {
  jobId: string;
  lookbookId: string;

  pose: PoseId;
  engine: RenderEngine;

  modelImageUrl: string;
  garmentImageUrl: string;

  /**
   * LOCKED PROMPT — v1.0
   * Single-line, pre-resolved, deterministic
   * No mutation allowed downstream
   */
  prompt: string;

  status: JobStatus;
  retries: number;

  outputImageUrl?: string;
  failureReason?: string;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   LOOKBOOK JOB (AGGREGATE)
   ========================================================= */

export interface LookbookJob {
  lookbookId: string;

  modelId: ModelId;
  garmentId: string;
  presetId: LookbookPresetId;

  poses: PoseId[];

  status: LookbookStatus;

  renderJobs: RenderJob[];

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   PRESET DEFINITIONS
   ========================================================= */

export const LOOKBOOK_PRESETS: Record<LookbookPresetId, PoseId[]> = {
  ecommerce_standard: ["front", "three_quarter", "side", "back"],
  quick_catalog: ["front", "three_quarter"],
  social_reel: ["three_quarter", "side", "front"],
  ethnic_pro: ["front", "three_quarter", "side", "back"],
};

/* =========================================================
   MODEL REGISTRY (V1)
   ========================================================= */

export const MODELS: Record<ModelId, Model> = {
  riya: {
    modelId: "riya",
    displayName: "Riya",
    basePoseImages: {
      front: "MODEL_FRONT_BASE_URL",
      three_quarter: "MODEL_THREE_QUARTER_BASE_URL",
      side: "MODEL_SIDE_BASE_URL",
      back: "MODEL_BACK_BASE_URL",
    },
  },
};

/* =========================================================
   JOB STATE TRANSITIONS (GUARDED)
   ========================================================= */

export const VALID_RENDER_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  pending: ["running", "skipped"],
  running: ["completed", "failed"],
  completed: [],
  failed: [],
  skipped: [],
};

export const VALID_LOOKBOOK_TRANSITIONS: Record<
  LookbookStatus,
  LookbookStatus[]
> = {
  created: ["processing"],
  processing: ["completed", "partial", "failed"],
  completed: [],
  partial: [],
  failed: [],
};
