-- Run this in your Supabase SQL Editor to create the license_keys table
-- Enables RLS and policy for the service to insert/select

CREATE TABLE IF NOT EXISTS license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value TEXT UNIQUE NOT NULL,
  hwid TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_license_keys_key ON license_keys(key_value);
CREATE INDEX IF NOT EXISTS idx_license_keys_hwid ON license_keys(hwid);
CREATE INDEX IF NOT EXISTS idx_license_keys_expires ON license_keys(expires_at);

-- RLS: Service role (used by API) bypasses RLS. Table is only accessed server-side.
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

-- Allow all for authenticated/service (API uses service key)
CREATE POLICY "Service access" ON license_keys FOR ALL USING (true) WITH CHECK (true);
