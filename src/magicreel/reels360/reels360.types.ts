export interface Generate360ReelRequest {
  heroImageUrl: string;
  backHeroImageUrl: string;
}

export interface Generate360ReelResponse {
  success: boolean;
  runId: string;
}

export interface Reel360StatusResponse {
  success: boolean;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}