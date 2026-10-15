import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function encryptionKey(): Buffer {
  const configured = process.env.META_TOKEN_ENCRYPTION_KEY;
  if (!configured || !/^[a-fA-F0-9]{64}$/.test(configured)) {
    throw new Error("META_TOKEN_ENCRYPTION_KEY_MUST_BE_32_BYTE_HEX");
  }
  return Buffer.from(configured, "hex");
}

/** Format: v1:<12-byte-IV-hex>:<auth-tag-hex>:<ciphertext-hex> */
export function encryptMetaToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decryptMetaToken(value: string): string {
  const [version, ivHex, tagHex, ciphertextHex] = value.split(":");
  if (version !== "v1" || !ivHex || !tagHex || !ciphertextHex) {
    throw new Error("META_TOKEN_CIPHERTEXT_INVALID");
  }
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}
