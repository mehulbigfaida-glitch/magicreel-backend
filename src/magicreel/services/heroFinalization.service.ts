import fs from "fs";
import path from "path";

/**
 * Inputs required to finalize hero image
 */
interface HeroFinalizationInput {
  jobId: string;

  // Root outputs directory, e.g. magicreel/outputs/{jobId}
  outputRoot: string;

  // Optional edits coming from View page
  backgroundImagePath?: string;
  logoImagePath?: string;
  enhance?: boolean;
}

/**
 * FINALIZE HERO IMAGE
 * - No AI
 * - Deterministic
 * - Produces hero_final.png
 */
export function finalizeHeroImage(
  input: HeroFinalizationInput
): void {
  const {
    jobId,
    outputRoot,
    backgroundImagePath,
    logoImagePath,
    enhance
  } = input;

  const tryonHeroPath = path.join(
    outputRoot,
    "tryon",
    "hero_base.png"
  );

  if (!fs.existsSync(tryonHeroPath)) {
    throw new Error("HERO_FINALIZATION_FAILED: HERO_BASE_NOT_FOUND");
  }

  const heroDir = path.join(outputRoot, "hero");
  ensureDir(heroDir);

  const finalHeroPath = path.join(heroDir, "hero_final.png");

  /**
   * v1 IMPLEMENTATION:
   * For now, we simply copy the hero base.
   * Background / logo / enhance hooks are ready
   * but do not mutate image yet.
   *
   * This keeps behavior safe and predictable.
   */
  fs.copyFileSync(tryonHeroPath, finalHeroPath);

  /**
   * Future-safe hooks (NO-OP in v1):
   * - applyBackground()
   * - applyLogo()
   * - applyEnhancement()
   */
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
