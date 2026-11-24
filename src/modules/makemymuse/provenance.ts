import { createHash, createPrivateKey, createPublicKey, sign, verify } from "crypto";
import sharp from "sharp";
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

export function signCertificateHash(hash: string) {
  const privatePem = process.env.MAKEMYMUSE_PROVENANCE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const publicPem = process.env.MAKEMYMUSE_PROVENANCE_PUBLIC_KEY?.replace(/\\n/g, "\n");
  if (!privatePem || !publicPem) return { signature: null, publicKeyPem: null, keyId: null, signatureStatus: "NOT_CONFIGURED" as const };
  const privateKey = createPrivateKey(privatePem);
  const publicKey = createPublicKey(publicPem);
  const sig = sign(null, Buffer.from(hash, "hex"), privateKey);
  if (!verify(null, Buffer.from(hash, "hex"), publicKey, sig)) throw new Error("MakeMyMuse provenance key pair mismatch.");
  const signature = sig.toString("base64");
  const keyId = createHash("sha256").update(publicKey.export({ type: "spki", format: "der" })).digest("hex").slice(0, 16);
  return { signature, publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(), keyId, signatureStatus: "SIGNED" as const };
}

export async function differenceHash(buffer: Buffer): Promise<string> {
  const pixels = await sharp(buffer).resize(9, 8, { fit: "fill" }).grayscale().raw().toBuffer();
  let bits = 0n;
  let index = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (pixels[y * 9 + x] > pixels[y * 9 + x + 1]) bits |= 1n << BigInt(index);
      index++;
    }
  }
  return bits.toString(16).padStart(16, "0");
}
export function hashDistance(a: string, b: string): number {
  let value = BigInt("0x" + a) ^ BigInt("0x" + b);
  let count = 0;
  while (value) { count += Number(value & 1n); value >>= 1n; }
  return count;
}
