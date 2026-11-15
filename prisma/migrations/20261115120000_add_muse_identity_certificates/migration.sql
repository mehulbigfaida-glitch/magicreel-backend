-- Additive Muse provenance certificate registry; existing Muses remain unchanged.
ALTER TABLE "muses" ADD COLUMN IF NOT EXISTS "certificate_id" TEXT, ADD COLUMN IF NOT EXISTS "provenance_hash" TEXT, ADD COLUMN IF NOT EXISTS "certificate_created_at" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "muses_certificate_id_key" ON "muses"("certificate_id");
CREATE TABLE IF NOT EXISTS "muse_certificates" ("id" TEXT NOT NULL, "muse_id" TEXT NOT NULL, "certificate_id" TEXT NOT NULL, "manifest" JSONB NOT NULL, "manifest_hash" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'PROVISIONAL', "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "revoked_at" TIMESTAMP(3), "revocation_note" TEXT, CONSTRAINT "muse_certificates_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX IF NOT EXISTS "muse_certificates_muse_id_key" ON "muse_certificates"("muse_id");
CREATE UNIQUE INDEX IF NOT EXISTS "muse_certificates_certificate_id_key" ON "muse_certificates"("certificate_id");
CREATE INDEX IF NOT EXISTS "muse_certificates_certificate_id_status_idx" ON "muse_certificates"("certificate_id", "status");
