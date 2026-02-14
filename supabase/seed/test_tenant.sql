-- =====================================================
-- SEED: Test Tenant for Development
-- Creates a second tenant for testing multi-tenant features
-- =====================================================

-- Test Tenant: "Inmobiliaria Demo"
INSERT INTO tenants (
  id,
  name,
  slug,
  subdomain,
  domain,
  logo_url,
  logo_dark_url,
  favicon_url,
  primary_color,
  secondary_color,
  accent_color,
  company_name,
  company_email,
  company_phone,
  company_address,
  company_whatsapp,
  social_links,
  template,
  plan,
  plan_expires_at,
  max_properties,
  max_agents,
  max_storage_mb,
  features,
  seo_title,
  seo_description,
  seo_keywords,
  is_active,
  settings
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Inmobiliaria Demo',
  'demo',
  'demo',
  NULL,
  NULL,
  NULL,
  NULL,
  '#2563EB',  -- Blue primary color
  '#1E293B',  -- Slate dark
  '#FFFFFF',
  'Inmobiliaria Demo S.A.S.',
  'contacto@inmobiliariademo.com',
  '+57 310 123 4567',
  'Calle 100 #15-20, Bogotá, Colombia',
  '+573101234567',
  '{
    "facebook": "https://facebook.com/inmobiliariademo",
    "instagram": "https://instagram.com/inmobiliariademo",
    "linkedin": null,
    "twitter": null,
    "youtube": null
  }',
  'modern',
  'professional',
  (NOW() + INTERVAL '1 year'),
  200,
  10,
  10000,
  '{
    "blog": true,
    "projects": true,
    "testimonials": true,
    "analytics": true,
    "custom_domain": true,
    "white_label": false,
    "api_access": true
  }',
  'Inmobiliaria Demo - Las mejores propiedades',
  'Encuentra tu hogar ideal con Inmobiliaria Demo. Propiedades en Bogotá y toda Colombia.',
  ARRAY['inmobiliaria', 'propiedades bogota', 'casas venta', 'apartamentos arriendo'],
  true,
  '{
    "currency": "COP",
    "language": "es",
    "timezone": "America/Bogota",
    "contact_form_webhook": null
  }'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  company_name = EXCLUDED.company_name,
  updated_at = NOW();

-- Create a test admin user for the demo tenant
-- Note: You need to create the auth user first in Supabase Auth
-- This just creates the profile if a user exists

-- Test properties for demo tenant
INSERT INTO properties (
  id,
  tenant_id,
  title,
  slug,
  description,
  property_type,
  operation_type,
  price,
  currency,
  bedrooms,
  bathrooms,
  parking_spots,
  area_built,
  area_total,
  address,
  city,
  neighborhood,
  latitude,
  longitude,
  features,
  images,
  is_featured,
  is_active,
  submission_status,
  created_at
) VALUES
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  'Apartamento moderno en Chicó',
  'apartamento-moderno-chico-demo',
  'Hermoso apartamento de 3 habitaciones con vista a la ciudad. Acabados de lujo, cocina integral y balcón. Edificio con gimnasio, piscina y seguridad 24/7.',
  'Apartamento',
  'Venta',
  850000000,
  'COP',
  3,
  2,
  2,
  120,
  120,
  'Calle 94 #11-30',
  'Bogotá',
  'Chicó',
  4.6768,
  -74.0447,
  ARRAY['Gimnasio', 'Piscina', 'Seguridad 24h', 'Parqueadero visitantes', 'Salón comunal'],
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  true,
  true,
  'approved',
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  'Casa campestre en La Calera',
  'casa-campestre-la-calera-demo',
  'Espectacular casa campestre con 5.000 m2 de terreno. 4 habitaciones, chimenea, zona BBQ y hermosos jardines. Perfecta para descansar del ruido de la ciudad.',
  'Casa',
  'Venta',
  1200000000,
  'COP',
  4,
  4,
  4,
  350,
  5000,
  'Vereda El Hato',
  'La Calera',
  'Vereda El Hato',
  4.7234,
  -73.9876,
  ARRAY['Chimenea', 'Zona BBQ', 'Jardines', 'Estudio', 'Vista panorámica'],
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
  true,
  true,
  'approved',
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  'Oficina en zona empresarial',
  'oficina-zona-empresarial-demo',
  'Oficina de 80 m2 en edificio empresarial de última generación. Ideal para empresas de tecnología o servicios profesionales.',
  'Oficina',
  'Arriendo',
  4500000,
  'COP',
  0,
  2,
  2,
  80,
  80,
  'Carrera 7 #71-21',
  'Bogotá',
  'Centro Internacional',
  4.6486,
  -74.0560,
  ARRAY['Aire acondicionado', 'Internet fibra', 'Recepción', 'Sala de juntas', 'Cafetería'],
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  false,
  true,
  'approved',
  NOW()
)
ON CONFLICT DO NOTHING;

-- Test agent for demo tenant
INSERT INTO agents (
  id,
  tenant_id,
  ghl_contact_id,
  name,
  slug,
  email,
  phone,
  whatsapp,
  bio,
  photo_url,
  specialties,
  languages,
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  NULL,
  'María García Demo',
  'maria-garcia-demo',
  'maria.garcia@inmobiliariademo.com',
  '+57 310 987 6543',
  '+573109876543',
  'Agente inmobiliaria con más de 10 años de experiencia en el sector. Especializada en propiedades de lujo en el norte de Bogotá.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  ARRAY['Propiedades de lujo', 'Apartamentos', 'Inversión inmobiliaria'],
  ARRAY['Español', 'Inglés'],
  true,
  NOW()
) ON CONFLICT DO NOTHING;

-- Test blog post for demo tenant
INSERT INTO blog_posts (
  id,
  tenant_id,
  title,
  slug,
  excerpt,
  content,
  cover_image,
  author_id,
  is_published,
  published_at,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  '5 Tips para comprar tu primera vivienda',
  '5-tips-comprar-primera-vivienda-demo',
  'Guía completa para quienes buscan adquirir su primera propiedad en Colombia.',
  '<h2>Introducción</h2><p>Comprar tu primera vivienda es uno de los pasos más importantes en la vida. Aquí te compartimos 5 consejos esenciales.</p><h2>1. Define tu presupuesto</h2><p>Antes de comenzar la búsqueda, es fundamental tener claro cuánto puedes invertir...</p><h2>2. Investiga la zona</h2><p>La ubicación es clave. Considera factores como transporte, comercio y seguridad...</p><h2>3. Verifica la documentación</h2><p>Asegúrate de que la propiedad tenga todos los documentos en regla...</p>',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  NULL,
  true,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Test testimonial for demo tenant
INSERT INTO testimonials (
  id,
  tenant_id,
  name,
  role,
  company,
  content,
  rating,
  photo_url,
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  'Carlos Rodríguez',
  'Comprador',
  NULL,
  'Excelente servicio de Inmobiliaria Demo. María me ayudó a encontrar el apartamento perfecto en tiempo récord. ¡Muy recomendados!',
  5,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  true,
  NOW()
) ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE! Test tenant created with sample data
-- =====================================================

-- To test multi-tenancy:
-- 1. Access via subdomain: demo.localhost:3000 (requires hosts file entry)
-- 2. Or set tenant header manually in middleware for testing
-- 3. Verify data isolation between 'redbot' and 'demo' tenants
