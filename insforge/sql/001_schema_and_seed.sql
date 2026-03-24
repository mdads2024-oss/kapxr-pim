-- KAPXR PIM - InsForge schema baseline (frontend-compatible)
-- Matches existing DTO/types shape from current app.

CREATE TABLE IF NOT EXISTS workspaces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_members (
  id SERIAL PRIMARY KEY,
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','editor','viewer')),
  status TEXT NOT NULL CHECK (status IN ('active','invited')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  uuid TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Active','Inactive')) DEFAULT 'Active',
  products INT NOT NULL DEFAULT 0,
  logo TEXT,
  logo_url TEXT,
  logo_object_key TEXT,
  logo_bucket_name TEXT,
  contact_email TEXT NOT NULL DEFAULT '',
  contact_phone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'system',
  UNIQUE (workspace_id, uuid)
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  products INT NOT NULL DEFAULT 0,
  subcategories TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Published','In Review','Draft')) DEFAULT 'Draft',
  completeness INT NOT NULL DEFAULT 0,
  channels INT NOT NULL DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, sku)
);

CREATE TABLE IF NOT EXISTS attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Text','Rich Text','Number','Select','Multi-select')),
  "group" TEXT NOT NULL,
  values INT,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  categories TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Image','Video','Document')),
  size TEXT,
  dimensions TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  date TEXT,
  bucket_name TEXT,
  object_key TEXT,
  url TEXT
);

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  logo TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Connected','Not Connected')) DEFAULT 'Not Connected',
  connected BOOLEAN NOT NULL DEFAULT FALSE,
  category TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS import_export_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Import','Export')),
  status TEXT NOT NULL CHECK (status IN ('Completed','Failed')),
  records INT NOT NULL DEFAULT 0,
  date TEXT,
  time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  change TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin','Editor','Viewer')),
  status TEXT NOT NULL CHECK (status IN ('Active','Invited')),
  initials TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS billing_plans (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE CHECK (code IN ('starter','growth','pro')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  yearly_price NUMERIC(10,2) NOT NULL,
  storage_limit_gb INT NOT NULL,
  seats_included INT NOT NULL,
  connectors_included INT NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  features JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS workspace_subscriptions (
  id SERIAL PRIMARY KEY,
  workspace_id INT NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  plan_code TEXT NOT NULL REFERENCES billing_plans(code),
  status TEXT NOT NULL CHECK (status IN ('trialing','active','past_due','canceled')),
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly','yearly')),
  provider TEXT NOT NULL CHECK (provider IN ('paypal')) DEFAULT 'paypal',
  renewal_date TEXT NOT NULL,
  trial_ends_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_workspace_status ON products(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_products_workspace_category ON products(workspace_id, category);

INSERT INTO workspaces (name, slug)
VALUES ('Default Workspace', 'default')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO billing_plans (code, name, description, monthly_price, yearly_price, storage_limit_gb, seats_included, connectors_included, is_popular, features)
VALUES
  ('starter', 'Starter', 'For early teams', 19, 190, 50, 5, 2, false, '["Core PIM","Basic analytics"]'::jsonb),
  ('growth', 'Growth', 'For scaling catalogs', 59, 590, 250, 20, 8, true, '["Advanced analytics","Import/Export"]'::jsonb),
  ('pro', 'Pro', 'For enterprise operations', 199, 1990, 1000, 100, 25, false, '["Priority support","Custom workflows"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

INSERT INTO workspace_subscriptions (workspace_id, organization_name, plan_code, status, billing_interval, provider, renewal_date)
SELECT id, 'Default Workspace', 'starter', 'active', 'monthly', 'paypal', TO_CHAR(NOW() + INTERVAL '30 days', 'YYYY-MM-DD')
FROM workspaces
WHERE slug = 'default'
ON CONFLICT (workspace_id) DO NOTHING;
