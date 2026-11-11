-- Additive Muse provenance fields; existing Muse rows remain valid.
ALTER TABLE "muses"
  ADD COLUMN "reference_public_id" TEXT,
  ADD COLUMN "candidate_collage_public_id" TEXT,
  ADD COLUMN "consent_record_id" TEXT,
  ADD COLUMN "generation_model" TEXT;

-- Durable, versioned record of customer consent and Muse creation provenance.
CREATE TABLE "muse_consent_records" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "muse_id" TEXT,
  "event_type" TEXT NOT NULL,
  "consent_version" TEXT NOT NULL,
  "consent_text" TEXT NOT NULL,
  "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reference_public_id" TEXT,
  "candidate_collage_public_id" TEXT,
  "candidate_public_id" TEXT,
  "candidate_number" INTEGER,
  "generation_model" TEXT,
  "prompt_version" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "muse_consent_records_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "muse_consent_records_user_id_accepted_at_idx"
  ON "muse_consent_records"("user_id", "accepted_at");
CREATE INDEX "muse_consent_records_muse_id_idx"
  ON "muse_consent_records"("muse_id");
