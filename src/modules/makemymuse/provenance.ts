import { createHash } from "crypto";
import { PromptBuildResult } from "./types";

export function sha256Buffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}
export function sha256Text(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}
export function makePromptProvenance(build: PromptBuildResult, provider: string, model: string, endpoint: string) {
  return {
    promptVersion: build.promptVersion,
    promptHash: sha256Text(build.prompt),
    promptManifest: build.manifest,
    provider,
    model,
    endpoint,
    recordedAt: new Date().toISOString(),
  };
}
