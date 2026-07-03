export interface CreateAIRequest {

  userId:string;

  garmentImageUrl:string;

  museId:string;

  // =====================
  // GARMENT INTELLIGENCE
  // =====================

  category?:string;

  garmentName?:string;

  fit?:string;

  tuckState?:string;

}

export interface CreateAIResponse {

  success:boolean;

  runId:string;

}