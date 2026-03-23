// backend/src/magicreel/p2m/p2m.types.ts
export type P2MCategory = "shirt";

export interface P2MAttributes {
  pattern?: "striped" | "checked" | "printed" | "solid";
  tuck?: "tucked" | "untucked";
  rolledSleeves?: boolean;
}

export interface P2MRunRequest {
  productImageUrl: string;
  category: P2MCategory;
  attributes: P2MAttributes;
}

export interface P2MRunResponse {
  success: boolean;
  jobId: string;
}

export interface P2MStatus {
  status: "pending" | "running" | "completed" | "failed";
  output?: string[];
  error?: string;
}
