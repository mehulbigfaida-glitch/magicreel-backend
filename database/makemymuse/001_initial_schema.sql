-- MakeMyMuse isolated product schema.
-- Applied to the shared database as an additive migration; no MagicReel tables were altered.

CREATE SCHEMA IF NOT EXISTS makemymuse;

CREATE TABLE IF NOT EXISTS makemymuse.creation_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'REFERENCE_UPLOADED',
  reference_image_url TEXT,
  reference_public_id TEXT,
  gender_presentation TEXT CHECK (gender_presentation IN ('female','male','androgynous')),
  age_appearance INTEGER CHECK (age_appearance BETWEEN 18 AND 60),
  skin_direction TEXT,
  selected_candidate_id TEXT,
  selected_body_type TEXT,
  final_model_url TEXT,
  final_model_public_id TEXT,
  muse_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS makemymuse.identity_blueprints (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL UNIQUE REFERENCES makemymuse.creation_sessions(id) ON DELETE CASCADE,
  preview_image_url TEXT,
  preview_public_id TEXT,
  anchor_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS makemymuse.face_generation_batches (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES makemymuse.creation_sessions(id) ON DELETE CASCADE,
  age_appearance INTEGER NOT NULL CHECK (age_appearance BETWEEN 18 AND 60),
  gender_presentation TEXT NOT NULL CHECK (gender_presentation IN ('female','male','androgynous')),
  collage_url TEXT,
  collage_public_id TEXT,
  provider TEXT,
  model_name TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS makemymuse.face_candidates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  batch_id TEXT NOT NULL REFERENCES makemymuse.face_generation_batches(id) ON DELETE CASCADE,
  candidate_number SMALLINT NOT NULL CHECK (candidate_number BETWEEN 1 AND 8),
  image_url TEXT,
  cloudinary_public_id TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(batch_id, candidate_number)
);

CREATE TABLE IF NOT EXISTS makemymuse.face_refinements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  candidate_id TEXT NOT NULL REFERENCES makemymuse.face_candidates(id) ON DELETE CASCADE,
  refinement_options JSONB NOT NULL DEFAULT '{}'::jsonb,
  preview_image_url TEXT,
  preview_public_id TEXT,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS makemymuse.face_approvals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES makemymuse.creation_sessions(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL REFERENCES makemymuse.face_candidates(id),
  approved_image_url TEXT NOT NULL,
  approved_public_id TEXT,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id)
);

CREATE TABLE IF NOT EXISTS makemymuse.model_assets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES makemymuse.creation_sessions(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS makemymuse.creation_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES makemymuse.creation_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS makemymuse.consent_records (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES makemymuse.creation_sessions(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reference_public_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mm_creation_sessions_user_created_idx ON makemymuse.creation_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS mm_face_batches_session_idx ON makemymuse.face_generation_batches(session_id);
CREATE INDEX IF NOT EXISTS mm_face_candidates_batch_idx ON makemymuse.face_candidates(batch_id);
CREATE INDEX IF NOT EXISTS mm_refinements_candidate_idx ON makemymuse.face_refinements(candidate_id);
CREATE INDEX IF NOT EXISTS mm_model_assets_session_idx ON makemymuse.model_assets(session_id);
CREATE INDEX IF NOT EXISTS mm_history_session_created_idx ON makemymuse.creation_history(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS mm_consent_user_created_idx ON makemymuse.consent_records(user_id, created_at DESC);

ALTER TABLE makemymuse.creation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.identity_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.face_generation_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.face_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.face_refinements ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.face_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.model_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.creation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE makemymuse.consent_records ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA makemymuse FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA makemymuse FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA makemymuse TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA makemymuse TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA makemymuse TO service_role;
