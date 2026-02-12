-- =====================================================
-- BLOG TABLES MIGRATION
-- Creates blog_posts and blog_categories tables
-- =====================================================

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,

  -- Author
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  author_avatar TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[],

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Status
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Metrics
  views_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================

-- Check if function exists, if not create it (may already exist from properties)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERT DEFAULT CATEGORIES
-- =====================================================

INSERT INTO blog_categories (name, slug, order_index) VALUES
  ('Consejos', 'consejos', 1),
  ('Inversión', 'inversion', 2),
  ('Mercado Inmobiliario', 'mercado', 3),
  ('Guías', 'guias', 4),
  ('Noticias', 'noticias', 5),
  ('Estilo de Vida', 'estilo-de-vida', 6)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STORAGE BUCKET FOR BLOG IMAGES
-- =====================================================

-- Create bucket for blog images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES FOR BLOG IMAGES
-- =====================================================

-- Allow public read access
DROP POLICY IF EXISTS "Public blog images access" ON storage.objects;
CREATE POLICY "Public blog images access"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload (admin check will be in API)
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
CREATE POLICY "Public can read published blog posts"
ON blog_posts FOR SELECT
USING (is_published = true);

-- Authenticated users can read all posts (for admin)
DROP POLICY IF EXISTS "Authenticated users can read all blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can read all blog posts"
ON blog_posts FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated users can insert posts
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can insert blog posts"
ON blog_posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update posts
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can update blog posts"
ON blog_posts FOR UPDATE
USING (auth.role() = 'authenticated');

-- Authenticated users can delete posts
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can delete blog posts"
ON blog_posts FOR DELETE
USING (auth.role() = 'authenticated');

-- Enable RLS on blog_categories
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
DROP POLICY IF EXISTS "Everyone can read blog categories" ON blog_categories;
CREATE POLICY "Everyone can read blog categories"
ON blog_categories FOR SELECT
USING (true);

-- Only authenticated can modify categories
DROP POLICY IF EXISTS "Authenticated users can manage blog categories" ON blog_categories;
CREATE POLICY "Authenticated users can manage blog categories"
ON blog_categories FOR ALL
USING (auth.role() = 'authenticated');
