// src/magicreel/engines/lookbookImage.engine.ts
// 🔒 Lookbook Image Engine — RenderJob CREATION ONLY (v1.0)

import { prisma } from "../db/prisma";
import { RenderJob, PoseId, MODELS, ModelId } from "../schema/lookbook.schema";
import { buildP2MPrompt } from "../prompts/promptBuilder";

/**
 * Input required to create a Lookbook RenderJob
 * One pose = one RenderJob
 */
interface GenerateLookbookJobInput {
  lookbookId: string;
  modelId: ModelId;
  garmentId: string;
  pose: PoseId;
}

/**
 * Create a RenderJob for Lookbook (NO EXECUTION)
 * - Binds locked prompt
 * - Resolves correct model image (front / back / pose-based)
 * - Sets initial job state
 */
export const createLookbookRenderJob = async (
  input: GenerateLookbookJobInput
): Promise<RenderJob> => {
  const { lookbookId, modelId, garmentId, pose } = input;

  /* ---------------------------------------------------------
     1️⃣ Resolve Garment (DB)
     --------------------------------------------------------- */
  const garment = await prisma.garment.findUnique({
    where: { id: garmentId },
  });

  if (!garment) {
    throw new Error("Garment not found");
  }

  /* ---------------------------------------------------------
     2️⃣ Resolve Model from REGISTRY (LOCKED)
     --------------------------------------------------------- */
  const model = MODELS[modelId];

  if (!model) {
    throw new Error(`Model not registered: ${modelId}`);
  }

  const modelImageUrl = model.basePoseImages[pose];

  if (!modelImageUrl) {
    throw new Error(`Model image not available for pose: ${pose}`);
  }

  /* ---------------------------------------------------------
     3️⃣ Resolve Garment Image (Lookbook uses FRONT garment)
     --------------------------------------------------------- */
  const garmentImageUrl = garment.frontImageUrl;

  /* ---------------------------------------------------------
     4️⃣ Bind LOCKED Product-to-Model Prompt
     --------------------------------------------------------- */
  const prompt = buildP2MPrompt({
    category: garment.category,
    avatarGender: "female",
    attributes: {},
  });

  /* ---------------------------------------------------------
     5️⃣ Create RenderJob (NO EXECUTION)
     --------------------------------------------------------- */
  const renderJob: RenderJob = {
    jobId: crypto.randomUUID(),
    lookbookId,

    pose,
    engine: "fashn",

    modelImageUrl,
    garmentImageUrl,
    prompt,

    status: "pending",
    retries: 0,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return renderJob;
};
