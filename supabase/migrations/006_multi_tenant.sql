-- =====================================================
-- MIGRATION: Multi-Tenant Architecture
-- Transforms the application from single-tenant to multi-tenant SaaS
-- =====================================================
-- This migration:
-- 1. Creates tenants table
-- 2. Adds tenant_id to all existing tables
-- 3. Creates default "redbot" tenant with existing data
-- 4. Updates RLS policies for tenant isolation
-- 5. Creates helper functions for tenant context
-- =====================================================

-- =====================================================
-- 1. TENANTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Domain configuration
  domain VARCHAR(255) UNIQUE,           -- Custom domain (e.g., inmobiliariaxyz.com)
  subdomain VARCHAR(100) UNIQUE,        -- Subdomain (e.g., xyz.redbot.io)

  -- Branding
  logo_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#C9A962',      -- Luxus gold
  secondary_color VARCHAR(7) DEFAULT '#1A1A1A',    -- Dark
  accent_color VARCHAR(7) DEFAULT '#FFFFFF',

  -- Contact info
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  company_phone VARCHAR(50),
  company_address TEXT,
  company_whatsapp VARCHAR(50),

  -- Social links
  social_links JSONB DEFAULT '{}',
  -- Structure: { facebook, instagram, linkedin, twitter, youtube, tiktok, whatsapp }

  -- Design template
  template VARCHAR(50) DEFAULT 'modern',
  -- Templates: 'modern', 'classic', 'minimal'

  -- Plan and billing
  plan VARCHAR(50) DEFAULT 'free',
  -- Plans: 'free', 'starter', 'professional', 'enterprise'
  plan_expires_at TIMESTAMPTZ,

  -- Limits based on plan
  max_properties INTEGER DEFAULT 10,
  max_agents INTEGER DEFAULT 1,
  max_storage_mb INTEGER DEFAULT 500,

  -- Features (can be toggled per tenant)
  features JSONB DEFAULT '{
    "blog": true,
    "projects": true,
    "testimonials": true,
    "analytics": false,
    "custom_domain": false,
    "white_label": false,
    "api_access": false
  }',

  -- SEO defaults
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  og_image_url TEXT,                      -- Open Graph image
  manifest_url TEXT,                      -- PWA manifest URL

  -- CRM Integration
  ghl_location_id VARCHAR(100),
  ghl_api_key TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Settings (flexible key-value)
  settings JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for tenant lookups
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain) WHERE domain IS NOT NULL;
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain) WHERE subdomain IS NOT NULL;
CREATE INDEX idx_tenants_is_active ON tenants(is_active);

-- Trigger for updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. CREATE DEFAULT TENANT (Redbot)
-- =====================================================

INSERT INTO tenants (
  id,
  name,
  slug,
  subdomain,
  company_name,
  company_email,
  company_phone,
  company_address,
  primary_color,
  secondary_color,
  template,
  plan,
  max_properties,
  max_agents,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Redbot Real Estate',
  'redbot',
  'app',
  'Redbot Real Estate',
  'info@redbotrealestate.com',
  '+57 300 000 0000',
  'Bogotá, Colombia',
  '#C9A962',
  '#1A1A1A',
  'modern',
  'enterprise',
  999999,
  999999,
  true
) ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. ADD tenant_id TO ALL TABLES
-- =====================================================

-- 3.1 PROFILES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);

-- 3.2 AGENTS
ALTER TABLE agents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE agents SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE agents ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE agents ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_agents_tenant_id ON agents(tenant_id);
-- Composite unique: slug must be unique per tenant
ALTER TABLE agents DROP CONSTRAINT IF EXISTS agents_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_tenant_slug ON agents(tenant_id, slug);

-- 3.3 PROPERTIES
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE properties SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE properties ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE properties ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON properties(tenant_id);
-- Composite unique: slug must be unique per tenant
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_tenant_slug ON properties(tenant_id, slug);

-- 3.4 PROJECTS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE projects SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE projects ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE projects ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects(tenant_id);
-- Composite unique: slug must be unique per tenant
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_tenant_slug ON projects(tenant_id, slug);

-- 3.5 BLOG_POSTS
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE blog_posts SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE blog_posts ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_blog_posts_tenant_id ON blog_posts(tenant_id);
-- Composite unique: slug must be unique per tenant
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_tenant_slug ON blog_posts(tenant_id, slug);

-- 3.6 BLOG_CATEGORIES
ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE blog_categories SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE blog_categories ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE blog_categories ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_blog_categories_tenant_id ON blog_categories(tenant_id);
-- Composite unique: slug must be unique per tenant
ALTER TABLE blog_categories DROP CONSTRAINT IF EXISTS blog_categories_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_categories_tenant_slug ON blog_categories(tenant_id, slug);

-- 3.7 CONTACT_SUBMISSIONS
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE contact_submissions SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE contact_submissions ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_contact_submissions_tenant_id ON contact_submissions(tenant_id);

-- 3.8 NOTIFICATIONS
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE notifications SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE notifications ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE notifications ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);

-- 3.9 TESTIMONIALS
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE testimonials SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE testimonials ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_testimonials_tenant_id ON testimonials(tenant_id);

-- 3.10 FAVORITES
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE favorites SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE favorites ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE favorites ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
CREATE INDEX IF NOT EXISTS idx_favorites_tenant_id ON favorites(tenant_id);

-- =====================================================
-- 4. MODIFY SITE_SETTINGS FOR MULTI-TENANT
-- =====================================================

-- Add tenant_id column
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
UPDATE site_settings SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
ALTER TABLE site_settings ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE site_settings ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';

-- Change primary key to include tenant_id
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
ALTER TABLE site_settings ADD PRIMARY KEY (tenant_id, key);

CREATE INDEX IF NOT EXISTS idx_site_settings_tenant_id ON site_settings(tenant_id);

-- =====================================================
-- 5. HELPER FUNCTIONS FOR TENANT CONTEXT
-- =====================================================

-- Get tenant_id from user profile
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get tenant_id from user (alias for compatibility)
CREATE OR REPLACE FUNCTION get_my_tenant_id()
RETURNS UUID AS $$
  SELECT get_user_tenant_id()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if user is Super Admin (role = 0)
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 0
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if user is Tenant Admin (role = 1)
CREATE OR REPLACE FUNCTION is_tenant_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 1
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get tenant by slug
CREATE OR REPLACE FUNCTION get_tenant_by_slug(p_slug VARCHAR)
RETURNS tenants AS $$
  SELECT * FROM tenants WHERE slug = p_slug AND is_active = true
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get tenant by domain
CREATE OR REPLACE FUNCTION get_tenant_by_domain(p_domain VARCHAR)
RETURNS tenants AS $$
  SELECT * FROM tenants
  WHERE (domain = p_domain OR subdomain = p_domain)
    AND is_active = true
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =====================================================
-- 6. UPDATE USER ROLE CHECK (Add Super Admin)
-- =====================================================

-- Update role constraint on profiles to allow role 0 (Super Admin)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN (0, 1, 2, 3));

-- Update comments
COMMENT ON TABLE profiles IS 'User profiles with role management. Roles: 0=SuperAdmin, 1=Admin, 2=Agente, 3=Usuario';

-- =====================================================
-- 7. RLS POLICIES - TENANT ISOLATION
-- =====================================================

-- Enable RLS on tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- ----- TENANTS POLICIES -----

-- Super admins can see all tenants
CREATE POLICY "Super admins can view all tenants"
  ON tenants FOR SELECT
  USING (is_super_admin());

-- Users can see their own tenant
CREATE POLICY "Users can view own tenant"
  ON tenants FOR SELECT
  USING (id = get_user_tenant_id());

-- Super admins can manage tenants
CREATE POLICY "Super admins can manage tenants"
  ON tenants FOR ALL
  USING (is_super_admin());

-- ----- UPDATE EXISTING POLICIES WITH TENANT ISOLATION -----

-- Drop and recreate policies for tenant isolation

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view tenant profiles"
  ON profiles FOR SELECT
  USING (
    is_tenant_admin() AND tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update tenant profiles"
  ON profiles FOR UPDATE
  USING (
    is_tenant_admin() AND tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Super admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_super_admin());

CREATE POLICY "Admins can delete tenant profiles"
  ON profiles FOR DELETE
  USING (
    is_tenant_admin() AND tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Super admins can delete any profile"
  ON profiles FOR DELETE
  USING (is_super_admin());

-- AGENTS
DROP POLICY IF EXISTS "Public can read active agents" ON agents;

CREATE POLICY "Public can read tenant active agents"
  ON agents FOR SELECT
  USING (is_active = true);
  -- Note: tenant filtering is done in the query layer for public routes

CREATE POLICY "Admins can manage tenant agents"
  ON agents FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- PROPERTIES
DROP POLICY IF EXISTS "Public can read approved active properties" ON properties;
DROP POLICY IF EXISTS "Users can view own properties" ON properties;
DROP POLICY IF EXISTS "Agents can view assigned properties" ON properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON properties;
DROP POLICY IF EXISTS "Users can submit properties" ON properties;
DROP POLICY IF EXISTS "Users can update own pending properties" ON properties;
DROP POLICY IF EXISTS "Admins can update any property" ON properties;
DROP POLICY IF EXISTS "Admins can delete any property" ON properties;

CREATE POLICY "Public can read tenant approved properties"
  ON properties FOR SELECT
  USING (is_active = true AND submission_status = 'approved');

CREATE POLICY "Users can view own properties"
  ON properties FOR SELECT
  USING (auth.uid() = submitted_by);

CREATE POLICY "Agents can view assigned properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN agents a ON p.agent_id = a.id
      WHERE p.id = auth.uid()
        AND properties.agent_id = a.id
        AND properties.tenant_id = p.tenant_id
    )
  );

CREATE POLICY "Admins can view tenant properties"
  ON properties FOR SELECT
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

CREATE POLICY "Users can submit properties to their tenant"
  ON properties FOR INSERT
  WITH CHECK (
    auth.uid() = submitted_by
    AND submission_status = 'pending'
    AND tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Users can update own pending properties"
  ON properties FOR UPDATE
  USING (
    auth.uid() = submitted_by
    AND submission_status = 'pending'
  )
  WITH CHECK (
    auth.uid() = submitted_by
    AND submission_status = 'pending'
  );

CREATE POLICY "Admins can manage tenant properties"
  ON properties FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- PROJECTS
DROP POLICY IF EXISTS "Public can read active projects" ON projects;

CREATE POLICY "Public can read tenant active projects"
  ON projects FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage tenant projects"
  ON projects FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- BLOG_POSTS
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;

CREATE POLICY "Public can read tenant published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage tenant blog posts"
  ON blog_posts FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- BLOG_CATEGORIES
DROP POLICY IF EXISTS "Everyone can read blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can manage blog categories" ON blog_categories;

CREATE POLICY "Public can read tenant categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tenant categories"
  ON blog_categories FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- CONTACT_SUBMISSIONS
DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Agents can view assigned submissions" ON contact_submissions;

CREATE POLICY "Public can create tenant submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);
  -- Note: tenant_id is set by the application based on the current domain

CREATE POLICY "Admins can view tenant submissions"
  ON contact_submissions FOR SELECT
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

CREATE POLICY "Agents can view assigned tenant submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN agents a ON p.agent_id = a.id
      WHERE p.id = auth.uid()
        AND (contact_submissions.agent_id = a.id OR contact_submissions.agent_id IS NULL)
        AND contact_submissions.tenant_id = p.tenant_id
    )
  );

CREATE POLICY "Admins can update tenant submissions"
  ON contact_submissions FOR UPDATE
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- TESTIMONIALS
DROP POLICY IF EXISTS "Public can read active testimonials" ON testimonials;

CREATE POLICY "Public can read tenant testimonials"
  ON testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage tenant testimonials"
  ON testimonials FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

CREATE POLICY "Users can view own tenant notifications"
  ON notifications FOR SELECT
  USING (
    auth.uid() = user_id
    AND tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- FAVORITES
DROP POLICY IF EXISTS "Users can manage their favorites" ON favorites;

CREATE POLICY "Users can manage own tenant favorites"
  ON favorites FOR ALL
  USING (
    auth.uid() = user_id
    AND tenant_id = get_user_tenant_id()
  );

-- SITE_SETTINGS
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;

CREATE POLICY "Public can read tenant settings"
  ON site_settings FOR SELECT
  USING (true);
  -- Note: tenant filtering is done in queries

CREATE POLICY "Admins can manage tenant settings"
  ON site_settings FOR ALL
  USING (
    (is_tenant_admin() AND tenant_id = get_user_tenant_id())
    OR is_super_admin()
  );

-- =====================================================
-- 8. UPDATE TRIGGER FUNCTIONS FOR TENANT CONTEXT
-- =====================================================

-- Update handle_new_user to include tenant_id
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Get tenant_id from metadata or use default
  v_tenant_id := COALESCE(
    (NEW.raw_user_meta_data->>'tenant_id')::UUID,
    '00000000-0000-0000-0000-000000000001'
  );

  INSERT INTO public.profiles (id, email, full_name, tenant_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_tenant_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update notify_admins to be tenant-aware
CREATE OR REPLACE FUNCTION notify_admins(
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}',
  p_tenant_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  v_tenant_id := COALESCE(p_tenant_id, get_user_tenant_id());

  INSERT INTO notifications (user_id, type, title, message, data, tenant_id)
  SELECT id, p_type, p_title, p_message, p_data, v_tenant_id
  FROM profiles
  WHERE role = 1
    AND is_active = true
    AND tenant_id = v_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update create_notification to include tenant_id
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
  v_tenant_id UUID;
BEGIN
  SELECT tenant_id INTO v_tenant_id FROM profiles WHERE id = p_user_id;

  INSERT INTO notifications (user_id, type, title, message, data, tenant_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_data, v_tenant_id)
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. MIGRATION COMPLETE
-- =====================================================

-- Add comment for documentation
COMMENT ON TABLE tenants IS 'Multi-tenant configuration. Each tenant represents a separate real estate company using the platform.';
COMMENT ON COLUMN tenants.slug IS 'URL-friendly identifier, used in subdomains';
COMMENT ON COLUMN tenants.domain IS 'Custom domain for white-label (e.g., inmobiliaria.com)';
COMMENT ON COLUMN tenants.subdomain IS 'Subdomain under main platform (e.g., xyz for xyz.redbot.io)';
COMMENT ON COLUMN tenants.template IS 'UI template: modern, classic, minimal';
COMMENT ON COLUMN tenants.plan IS 'Subscription plan: free, starter, professional, enterprise';
COMMENT ON COLUMN tenants.features IS 'Feature flags JSON for tenant capabilities';

-- =====================================================
-- DONE! Multi-tenant migration complete
-- =====================================================
