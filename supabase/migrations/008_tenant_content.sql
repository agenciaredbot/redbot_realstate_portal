-- =====================================================
-- MIGRATION: Tenant Content Customization
-- Adds fields for customizable content sections
-- =====================================================

-- Add content fields to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- About section
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS about_title TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS about_description TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS about_image_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS about_stats JSONB DEFAULT '{"properties": "0", "clients": "0", "years": "0", "agents": "0"}';

-- Footer content
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS footer_description TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS footer_copyright TEXT;

-- Additional branding
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS accent_color_2 VARCHAR(7) DEFAULT '#2563EB';  -- Secondary accent (blue)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS font_heading VARCHAR(100) DEFAULT 'DM Sans';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS font_body VARCHAR(100) DEFAULT 'Inter';

-- Contact page content
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS contact_title TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS contact_description TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS contact_map_url TEXT;

-- Update default tenant with sample content
UPDATE tenants
SET
  hero_title = 'Encuentra Tu Propiedad Ideal',
  hero_subtitle = 'Explora nuestra amplia selección de propiedades y encuentra el lugar perfecto que se ajuste a tus necesidades y estilo de vida.',
  about_title = 'Sobre Nosotros',
  about_description = 'Somos una inmobiliaria comprometida con ayudarte a encontrar el hogar de tus sueños. Con años de experiencia en el mercado, ofrecemos un servicio personalizado y profesional.',
  about_stats = '{"properties": "250+", "clients": "500+", "years": "10+", "agents": "15+"}',
  footer_description = 'Tu socio confiable en el mercado inmobiliario. Encuentra la propiedad perfecta con nosotros.',
  footer_copyright = '© 2024 Todos los derechos reservados.'
WHERE id = '00000000-0000-0000-0000-000000000001';
