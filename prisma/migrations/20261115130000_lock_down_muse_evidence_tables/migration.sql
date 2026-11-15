-- Keep the production Muse evidence-table lockdown represented in Prisma migration history.
-- Safe to run when the equivalent controls have already been applied manually.
ALTER TABLE public.muse_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muse_certificates ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.muse_consent_records FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.muse_certificates FROM PUBLIC, anon, authenticated;
