// src/video/director/operators/operator.interface.ts

export interface DirectorSceneInput {
  jobId: string;
  sceneId: string;
  preset: string;
  durationMs: number;
  script?: string;
  metadata?: Record<string, any>;
}

export interface DirectorSceneOutput {
  sceneId: string;
  videoPath: string;
  durationMs: number;
}

export interface DirectorSceneOperator {
  id: string;
  label: string;
  generate(input: DirectorSceneInput): Promise<DirectorSceneOutput>;
}
