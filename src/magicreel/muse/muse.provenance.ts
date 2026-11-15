import { createHash, createPrivateKey, createPublicKey, sign, verify } from "crypto";
import axios from "axios";

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(object[key])}`).join(",")}}`;
}

export function hashManifest(manifest: unknown): string {
  return createHash("sha256").update(canonicalJson(manifest), "utf8").digest("hex");
}

export async function hashRemoteImage(url: string): Promise<string> {
  const response = await axios.get<ArrayBuffer>(url, { responseType: "arraybuffer", timeout: 30000, maxContentLength: 25 * 1024 * 1024 });
  return createHash("sha256").update(Buffer.from(response.data)).digest("hex");
}

export function signManifestHash(hash: string): { signature: string | null; publicKeyPem: string | null; keyId: string | null } {
  const privatePem = process.env.MUSE_PROVENANCE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const publicPem = process.env.MUSE_PROVENANCE_PUBLIC_KEY?.replace(/\\n/g, "\n");
  if (!privatePem || !publicPem) return { signature: null, publicKeyPem: null, keyId: null };
  const privateKey = createPrivateKey(privatePem);
  const publicKey = createPublicKey(publicPem);
  const signature = sign(null, Buffer.from(hash, "hex"), privateKey).toString("base64");
  const keyId = createHash("sha256").update(publicKey.export({ type: "spki", format: "der" })).digest("hex").slice(0, 16);
  return { signature, publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(), keyId };
}

export function verifyManifestHash(hash: string, signature: string | null, publicKeyPem: string | null): boolean | null {
  if (!signature || !publicKeyPem) return null;
  try { return verify(null, Buffer.from(hash, "hex"), createPublicKey(publicKeyPem), Buffer.from(signature, "base64")); }
  catch { return false; }
}
