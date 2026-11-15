-- Add optional Ed25519 signature material to Muse provenance certificates.
ALTER TABLE "muse_certificates"
  ADD COLUMN IF NOT EXISTS "signature" TEXT,
  ADD COLUMN IF NOT EXISTS "public_key_pem" TEXT,
  ADD COLUMN IF NOT EXISTS "signing_key_id" TEXT;
