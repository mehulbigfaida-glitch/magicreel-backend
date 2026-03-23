// src/lookbook/services/editorial/lookbookOrchestrator.ts
// 🔒 Lookbook Orchestrator — Generation + Editorial (v1.0)

import fs from "fs";
import path from "path";

import { generateLookbookPdf } from "../lookbookPdfService";
import { generateLookbookVideo } from "../lookbookVideoService";

import {
  LookbookPresetId,
} from "../../../magicreel/schema/lookbook.schema";

import { createLookbookJob } from "../../../magicreel/engines/lookbookJob.engine";
import { executeRenderJob } from "../../../magicreel/services/renderJobExecutor.service";

/* ------------------------------------------------------------------
   TYPES
------------------------------------------------------------------ */

export interface LookbookOrchestratorPayload {
  // v1.0 generation inputs
  lookbookId?: string;
  modelId?: "riya";
  garmentId?: string;
  presetId?: LookbookPresetId;

  // editorial inputs
  title?: string;
  description?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface LookbookOrchestratorResult {
  lookbookId: string;
  images: string[];

  // editorial outputs
  pdfPath?: string;
  videoPath?: string;
}

/* ------------------------------------------------------------------
   MAIN ORCHESTRATOR — v1.0
------------------------------------------------------------------ */

export const runLookbookOrchestrator = async (
  payload: LookbookOrchestratorPayload
): Promise<LookbookOrchestratorResult> => {
  const {
    lookbookId = `lookbook_${Date.now()}`,
    modelId = "riya",
    garmentId,
    presetId = "ecommerce_standard",
    title = "Lookbook",
    metadata,
  } = payload;

  if (!garmentId) {
    throw new Error("garmentId is required for lookbook generation");
  }

  /* ---------------------------------------------------------
     1️⃣ Create LookbookJob (NO EXECUTION)
     --------------------------------------------------------- */
  const lookbookJob = await createLookbookJob({
    lookbookId,
    modelId,
    garmentId,
    presetId,
  });

  /* ---------------------------------------------------------
     2️⃣ Execute RenderJobs sequentially
     --------------------------------------------------------- */
  const generatedImages: string[] = [];

  for (const job of lookbookJob.renderJobs) {
    const completedJob = await executeRenderJob(job);

    if (completedJob.status !== "completed" || !completedJob.outputImageUrl) {
      throw new Error(`Render failed for pose: ${job.pose}`);
    }

    generatedImages.push(completedJob.outputImageUrl);
  }

  /* ---------------------------------------------------------
     3️⃣ Editorial Outputs (PDF / Video)
     --------------------------------------------------------- */
  const baseDir = path.join(
    process.cwd(),
    "storage",
    "lookbook",
    lookbookId
  );
  await fs.promises.mkdir(baseDir, { recursive: true });

  const pdfPath = await generateLookbookPdf(
    lookbookId,
    generatedImages,
    presetId,
    title
  );

  const videoPath = await generateLookbookVideo(
    lookbookId,
    generatedImages,
    presetId,
    metadata
  );

  /* ---------------------------------------------------------
     4️⃣ Return
     --------------------------------------------------------- */
  return {
    lookbookId,
    images: generatedImages,
    pdfPath,
    videoPath,
  };
};
