import fs from "fs";
import path from "path";

import { generateLookbookPosePlan } from "../../lookbook/services/lookbookPoseGenerator";
import { validateLookbookJob } from "../../lookbook/validation/garment.validator";
import { persistAnchorImage } from "../../lookbook/services/lookbookImageService";
import { sealLookbook } from "./lookbookSeal.service";
import { LookbookPoseSlot } from "../../lookbook/services/lookbookPoseGenerator";

interface RunLookbookInput {
  jobId: string;
  category: string;
  hasBackImage: boolean;

  // Provided ONLY when user clicks "Generate Lookbook"
  anchorImagePath: string;

  // e.g. magicreel/outputs/{jobId}
  outputRoot: string;
}

/**
 * AUTHORITATIVE LOOKBOOK ORCHESTRATOR
 */
export async function runLookbook(
  input: RunLookbookInput
): Promise<void> {
  const {
    jobId,
    category,
    hasBackImage,
    anchorImagePath,
    outputRoot
  } = input;

  // --------------------------------------------------
  // 1. Hard gate — anchor image is mandatory
  // --------------------------------------------------
  if (!anchorImagePath || !fs.existsSync(anchorImagePath)) {
    throw new Error("LOOKBOOK_RUN_FAILED: ANCHOR_IMAGE_REQUIRED");
  }

  // --------------------------------------------------
  // 2. Pose plan (single source of truth)
  // --------------------------------------------------
  const posePlan = generateLookbookPosePlan({
    category,
    hasBackImage,
    hasUserImage: true
  });

  // --------------------------------------------------
  // 3. Validation
  // --------------------------------------------------
  validateLookbookJob({
    category,
    hasBackImage,
    anchorImagePath,
    posePlan
  });

  // --------------------------------------------------
  // 4. Persist anchor as slot 0 (user.png)
  // --------------------------------------------------
  persistAnchorImage({
    jobId,
    outputRoot,
    anchorImagePath
  });

  /**
   * NOTE:
   * Pose image generation (hero, angled, back, etc.)
   * already happens in existing workers.
   * We do NOT trigger generation here.
   */

  // --------------------------------------------------
  // 5. Normalize outputs into lookbook/
  // --------------------------------------------------
  normalizeLookbookOutputs({
    jobId,
    outputRoot,
    posePlan
  });

  // --------------------------------------------------
  // 6. Seal lookbook (final authority)
  // --------------------------------------------------
  sealLookbook(outputRoot);
}

/* ------------------------------------------------------------------ */
/* OUTPUT NORMALIZATION — LOCAL & AUTHORITATIVE                        */
/* ------------------------------------------------------------------ */

const POSE_FILENAME_MAP: Record<string, string> = {
  user_anchor: "user.png",
  hero: "hero.png",
  angled: "angled.png",
  zoomed_hero: "zoomed_hero.png",
  back: "back.png",
  zoomed_back: "zoomed_back.png",

  // category fallbacks
  side_profile: "side_profile.png",
  detail_zoom: "detail.png",
  collar_zoom: "collar.png",
  neckline_zoom: "neckline.png",
  movement: "movement.png",
  fabric_flow: "fabric_flow.png",
  waist_fit_zoom: "waist_fit.png",
  leg_silhouette: "leg_silhouette.png",
  pallu_detail: "pallu.png",
  border_zoom: "border.png",
  open_front: "open_front.png",
  texture_zoom: "texture.png"
};

function normalizeLookbookOutputs(input: {
  jobId: string;
  outputRoot: string;
  posePlan: LookbookPoseSlot[];
}): void {
  const { outputRoot, posePlan } = input;

  const lookbookDir = path.join(outputRoot, "lookbook");
  ensureDir(lookbookDir);

  for (const pose of posePlan) {
    const filename = POSE_FILENAME_MAP[pose.type];
    if (!filename) {
      throw new Error(
        `LOOKBOOK_OUTPUT_ERROR: NO_FILENAME_FOR_${pose.type}`
      );
    }

    // Legacy generation location
    const legacyPath = path.join(
      outputRoot,
      "poses",
      `look_${pose.slot + 1}.png`
    );

    const targetPath = path.join(lookbookDir, filename);

    // user.png already copied earlier
    if (pose.type === "user_anchor") {
      continue;
    }

    if (!fs.existsSync(legacyPath)) {
      throw new Error(
        `LOOKBOOK_OUTPUT_ERROR: MISSING_IMAGE_${pose.type}`
      );
    }

    fs.copyFileSync(legacyPath, targetPath);
  }

  writeManifest(lookbookDir, posePlan);
}

function writeManifest(
  lookbookDir: string,
  posePlan: LookbookPoseSlot[]
): void {
  const manifest = {
    generatedAt: new Date().toISOString(),
    poses: posePlan.map(p => ({
      slot: p.slot,
      type: p.type,
      filename: POSE_FILENAME_MAP[p.type]
    }))
  };

  fs.writeFileSync(
    path.join(lookbookDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
