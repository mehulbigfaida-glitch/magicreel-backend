export interface CreateAIRequest {
  userId: string;

  garmentImageUrl: string;

  museId: string;
}

export interface CreateAIResponse {
  success: boolean;

  runId: string;
}