-- MagicReel Myntra Brand Contact Intelligence
-- Deliberately separate from customer/product data.

CREATE TABLE IF NOT EXISTS myntra_extraction_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  seed_count INTEGER NOT NULL DEFAULT 0,
  discovered_count INTEGER NOT NULL DEFAULT 0,
  enriched_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS myntra_brand_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_brand TEXT NOT NULL,
  brand_key TEXT NOT NULL UNIQUE,
  myntra_url TEXT,
  representative_product_url TEXT,
  product_code TEXT,
  seller_name TEXT,
  supplier_company TEXT,
  manufacturer TEXT,
  marketer TEXT,
  importer TEXT,
  business_email TEXT,
  business_phone TEXT,
  official_website TEXT,
  official_contact_url TEXT,
  linkedin_url TEXT,
  business_address TEXT,
  quality_tier TEXT NOT NULL DEFAULT 'D',
  extraction_status TEXT NOT NULL DEFAULT 'DISCOVERED',
  contact_status TEXT NOT NULL DEFAULT 'NOT_CHECKED',
  notes TEXT,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_checked_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_myntra_brand_leads_quality ON myntra_brand_leads(quality_tier);
CREATE INDEX IF NOT EXISTS idx_myntra_brand_leads_status ON myntra_brand_leads(extraction_status);
CREATE INDEX IF NOT EXISTS idx_myntra_brand_leads_company ON myntra_brand_leads(supplier_company);

CREATE TABLE IF NOT EXISTS myntra_brand_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES myntra_brand_leads(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_myntra_brand_evidence_brand ON myntra_brand_evidence(brand_id);
CREATE INDEX IF NOT EXISTS idx_myntra_brand_evidence_field ON myntra_brand_evidence(field_name);

CREATE TABLE IF NOT EXISTS myntra_brand_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES myntra_brand_leads(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_key TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(brand_id, alias_key)
);

CREATE INDEX IF NOT EXISTS idx_myntra_brand_aliases_key ON myntra_brand_aliases(alias_key);
