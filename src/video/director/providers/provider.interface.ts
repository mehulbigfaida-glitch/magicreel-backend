// src/video/director/providers/provider.interface.ts

export type DirectorProvider = "free" | "krea" | "runway";

export interface DirectorVideoParams {
  imageUrl?: string;
  prompt?: string;
  duration?: number;
  aspectRatio?: string;
  preset?: string;
  blueprintId?: string;
  // optional future extensibility
  metadata?: Record<string, unknown>;
}

export interface DirectorVideoResult {
  videoUrl: string;
  blueprintId?: string;
  preset?: string;
  provider: DirectorProvider;
  // provider-specific raw response for debugging / analytics
  raw?: any;
}

export interface DirectorVideoProvider {
  name: DirectorProvider;
  isAvailable(): boolean;
  generateVideo(params: DirectorVideoParams): Promise<DirectorVideoResult>;
}
