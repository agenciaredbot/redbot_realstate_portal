-- =====================================================
-- Redbot Real Estate Portal - Initial Schema
-- MVP 2: Database Setup
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. AGENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  bio TEXT,
  photo_url TEXT,
  role VARCHAR(100) DEFAULT 'Agente Inmobiliario',
  license_number VARCHAR(100),
  years_experience INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT ARRAY['Español'],
  social_links JSONB DEFAULT '{}',
  -- social_links structure: { facebook, instagram, linkedin, twitter, whatsapp }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_agents_slug ON agents(slug);
CREATE INDEX idx_agents_is_active ON agents(is_active);

-- =====================================================
-- 2. PROPERTIES TABLE
-- =====================================================
CREATE TYPE property_status AS ENUM ('venta', 'arriendo', 'venta_arriendo');
CREATE TYPE property_type AS ENUM ('apartamento', 'casa', 'oficina', 'local', 'lote', 'finca', 'bodega', 'consultorio');

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description_short TEXT,
  description TEXT,

  -- Status and Type
  status property_status NOT NULL DEFAULT 'venta',
  property_type property_type NOT NULL DEFAULT 'apartamento',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  -- Pricing
  price DECIMAL(15, 2) NOT NULL,
  price_currency VARCHAR(3) DEFAULT 'COP',
  admin_fee DECIMAL(15, 2),

  -- Location
  address VARCHAR(500),
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Specs
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking_spots INTEGER DEFAULT 0,
  area_m2 DECIMAL(10, 2),
  area_built_m2 DECIMAL(10, 2),
  year_built INTEGER,
  stratum INTEGER, -- Estrato (1-6 in Colombia)
  floor_number INTEGER,
  total_floors INTEGER,

  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  virtual_tour_url TEXT,

  -- Features
  amenities TEXT[] DEFAULT '{}',

  -- Agent relationship
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,

  -- Airtable sync
  airtable_id VARCHAR(50) UNIQUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_is_featured ON properties(is_featured);
CREATE INDEX idx_properties_is_active ON properties(is_active);
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_properties_airtable_id ON properties(airtable_id);

-- =====================================================
-- 3. CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TYPE inquiry_type AS ENUM ('comprar', 'vender', 'arrendar', 'inversion', 'otro', 'property_inquiry');

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,

  -- Inquiry details
  inquiry_type inquiry_type DEFAULT 'otro',
  message TEXT NOT NULL,

  -- Related entities (optional)
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,

  -- CRM integration
  ghl_contact_id VARCHAR(100),
  ghl_synced_at TIMESTAMPTZ,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'nuevo',
  notes TEXT,

  -- Metadata
  source VARCHAR(100) DEFAULT 'website',
  ip_address VARCHAR(50),
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- =====================================================
-- 4. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Person info
  name VARCHAR(200) NOT NULL,
  role VARCHAR(100),
  avatar_url TEXT,

  -- Content
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),

  -- Related property (optional)
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,

  -- Display settings
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);

-- =====================================================
-- 5. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Content
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,

  -- Media
  featured_image TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',

  -- Author
  author_name VARCHAR(200),
  author_avatar TEXT,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Status
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Stats
  views_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- =====================================================
-- 6. PROJECTS TABLE (Proyectos Inmobiliarios)
-- =====================================================
CREATE TYPE project_status AS ENUM ('preventa', 'en_construccion', 'entrega_inmediata', 'vendido');

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Basic info
  name VARCHAR(255) NOT NULL,
  developer VARCHAR(255),
  description_short TEXT,
  description TEXT,

  -- Status
  status project_status DEFAULT 'en_construccion',
  completion_date DATE,
  delivery_date DATE,

  -- Location
  address VARCHAR(500),
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Pricing
  price_from DECIMAL(15, 2),
  price_to DECIMAL(15, 2),
  price_currency VARCHAR(3) DEFAULT 'COP',

  -- Units info
  total_units INTEGER,
  available_units INTEGER,
  unit_types TEXT[], -- e.g., ['1 habitación', '2 habitaciones', '3 habitaciones']
  area_from DECIMAL(10, 2),
  area_to DECIMAL(10, 2),

  -- Media
  images TEXT[] DEFAULT '{}',
  logo_url TEXT,
  video_url TEXT,
  brochure_url TEXT,

  -- Features
  amenities TEXT[] DEFAULT '{}',

  -- Display
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_city ON projects(city);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_is_active ON projects(is_active);

-- =====================================================
-- 7. SITE SETTINGS TABLE (Key-Value Config)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
  ('company_name', '"Redbot Real Estate"', 'Company name'),
  ('company_phone', '"+57 300 000 0000"', 'Main phone number'),
  ('company_email', '"info@redbotrealestate.com"', 'Main email'),
  ('company_address', '"Bogotá, Colombia"', 'Office address'),
  ('social_links', '{"facebook": "", "instagram": "", "linkedin": "", "twitter": "", "youtube": "", "whatsapp": ""}', 'Social media links'),
  ('seo_defaults', '{"title": "Redbot Real Estate - Propiedades en Colombia", "description": "Encuentra tu propiedad ideal en Colombia"}', 'Default SEO settings')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 8. FAVORITES TABLE (Para MVP 3 - Auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Will reference auth.users in MVP 3
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, property_id)
);

-- Index
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- =====================================================
-- TRIGGERS: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Public read policies (for anonymous users)
CREATE POLICY "Public can read active agents" ON agents
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active properties" ON properties
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read active projects" ON projects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Public can insert contact submissions
CREATE POLICY "Public can create contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Service role has full access (used by admin operations)
-- Note: Service role key bypasses RLS by default

-- =====================================================
-- DONE! Schema created successfully
-- =====================================================
