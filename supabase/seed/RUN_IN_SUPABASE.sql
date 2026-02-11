-- =====================================================
-- COMPLETE SETUP SCRIPT FOR SUPABASE SQL EDITOR
-- =====================================================
-- This script:
-- 1. Adds reference_code column to properties
-- 2. Creates auto-generation trigger
-- 3. Inserts 10 sample properties
--
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- =====================================================

-- =====================================================
-- STEP 1: Add reference_code column
-- =====================================================
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS reference_code VARCHAR(20) UNIQUE;

-- =====================================================
-- STEP 2: Create sequence for auto-generating codes
-- =====================================================
CREATE SEQUENCE IF NOT EXISTS property_reference_seq START 1;

-- =====================================================
-- STEP 3: Create function to generate reference code
-- =====================================================
CREATE OR REPLACE FUNCTION generate_property_reference_code()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  -- Get next sequence value
  next_num := nextval('property_reference_seq');
  -- Format as RB-0001, RB-0002, etc.
  NEW.reference_code := 'RB-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: Create trigger to auto-assign on insert
-- =====================================================
DROP TRIGGER IF EXISTS set_property_reference_code ON properties;
CREATE TRIGGER set_property_reference_code
  BEFORE INSERT ON properties
  FOR EACH ROW
  WHEN (NEW.reference_code IS NULL)
  EXECUTE FUNCTION generate_property_reference_code();

-- =====================================================
-- STEP 5: Add views_count column if missing
-- =====================================================
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- =====================================================
-- STEP 6: Create index for reference_code
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_properties_reference_code ON properties(reference_code);

-- =====================================================
-- STEP 7: Insert sample properties
-- =====================================================

INSERT INTO properties (
  slug, title, description_short, description, status, property_type,
  price, price_currency, city, neighborhood, address,
  bedrooms, bathrooms, parking_spots, area_m2, area_built_m2,
  stratum, floor_number, total_floors, images, amenities,
  is_featured, is_active, submission_status, airtable_id
) VALUES

-- 1. Apartamento de lujo en Chicó
(
  'apartamento-lujo-chico-bogota',
  'Apartamento de Lujo en Chicó',
  'Espectacular apartamento con vista panorámica en el exclusivo sector de Chicó.',
  'Este elegante apartamento de 180m² ofrece acabados de primera calidad, pisos en madera, cocina integral con electrodomésticos de alta gama, y una vista impresionante de la ciudad.',
  'venta', 'apartamento', 850000000, 'COP',
  'Bogotá', 'Chicó', 'Calle 94 # 11-30',
  3, 3, 2, 180, 180, 6, 12, 20,
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  ARRAY['Gimnasio', 'Piscina', 'Salón social', 'Vigilancia 24h', 'Ascensor'],
  true, true, 'approved', 'SAMPLE-001'
),

-- 2. Casa campestre en Cota
(
  'casa-campestre-cota',
  'Hermosa Casa Campestre en Cota',
  'Casa campestre con amplios jardines, perfecta para disfrutar en familia.',
  'Espectacular casa campestre de 350m² construidos en un lote de 1500m². Cuenta con 4 habitaciones con baño privado, sala de estar con chimenea, y hermosos jardines.',
  'venta', 'casa', 1200000000, 'COP',
  'Cota', 'Vereda Parcelas', 'Km 5 Vía Cota-Chía',
  4, 5, 4, 1500, 350, NULL, NULL, 2,
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
  ARRAY['Jardín', 'BBQ', 'Chimenea', 'Zona verde', 'Parqueadero cubierto'],
  true, true, 'approved', 'SAMPLE-002'
),

-- 3. Apartamento en arriendo Chapinero
(
  'apartamento-arriendo-chapinero',
  'Moderno Apartamento en Chapinero Alto',
  'Apartamento moderno ideal para ejecutivos, cerca de todo.',
  'Apartamento de 75m² completamente remodelado en Chapinero Alto. Excelente ubicación cerca de universidades y transporte público.',
  'arriendo', 'apartamento', 3500000, 'COP',
  'Bogotá', 'Chapinero Alto', 'Carrera 7 # 53-20',
  2, 2, 1, 75, 75, 4, 8, 15,
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  ARRAY['Portería 24h', 'Ascensor', 'Balcón', 'Cocina integral'],
  false, true, 'approved', 'SAMPLE-003'
),

-- 4. Oficina en el Centro Internacional
(
  'oficina-centro-internacional-bogota',
  'Oficina Premium Centro Internacional',
  'Oficina ejecutiva en el corazón financiero de Bogotá.',
  'Oficina de 120m² en edificio corporativo clase A. Vista hacia los cerros orientales.',
  'arriendo', 'oficina', 8500000, 'COP',
  'Bogotá', 'Centro Internacional', 'Carrera 7 # 32-16, Oficina 1205',
  0, 2, 2, 120, 120, NULL, 12, 25,
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
  ARRAY['Recepción', 'Sala de juntas', 'Aire acondicionado', 'Ascensor'],
  true, true, 'approved', 'SAMPLE-004'
),

-- 5. Local comercial en Usaquén
(
  'local-comercial-usaquen',
  'Local Comercial en Zona Rosa de Usaquén',
  'Excelente local para restaurante o tienda en zona de alto tráfico.',
  'Local comercial de 85m² con vitrina hacia la calle principal. Alto flujo peatonal.',
  'arriendo', 'local', 12000000, 'COP',
  'Bogotá', 'Usaquén', 'Carrera 6 # 119-12',
  0, 1, 0, 85, 85, NULL, 1, 3,
  ARRAY['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800', 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800'],
  ARRAY['Vitrina', 'Instalación de gas', 'Baño', 'Alta afluencia'],
  false, true, 'approved', 'SAMPLE-005'
),

-- 6. Finca en Silvania
(
  'finca-silvania-cundinamarca',
  'Espectacular Finca de Descanso en Silvania',
  'Finca con clima cálido, piscina y amplias zonas verdes.',
  'Hermosa finca de recreo de 5000m² con casa principal de 280m² y casa de caseros. Cuenta con piscina y kiosko BBQ.',
  'venta', 'finca', 950000000, 'COP',
  'Silvania', 'Vereda Victoria', 'Km 8 Vía Silvania-Fusagasugá',
  5, 4, 6, 5000, 280, NULL, NULL, 2,
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800'],
  ARRAY['Piscina', 'BBQ', 'Cancha múltiple', 'Árboles frutales', 'Casa de caseros'],
  true, true, 'approved', 'SAMPLE-006'
),

-- 7. Penthouse en Santa Bárbara
(
  'penthouse-santa-barbara-bogota',
  'Penthouse Exclusivo en Santa Bárbara',
  'Penthouse dúplex con terraza privada y jacuzzi.',
  'Exclusivo penthouse dúplex de 320m² con terraza privada de 80m². Vista 360° de la ciudad.',
  'venta', 'apartamento', 2800000000, 'COP',
  'Bogotá', 'Santa Bárbara', 'Carrera 19 # 122-45, PH',
  4, 5, 3, 320, 320, 6, 18, 18,
  ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'],
  ARRAY['Terraza privada', 'Jacuzzi', 'BBQ', 'Vista panorámica', 'Gimnasio'],
  true, true, 'approved', 'SAMPLE-007'
),

-- 8. Bodega en Zona Industrial
(
  'bodega-zona-industrial-bogota',
  'Bodega Industrial en Puente Aranda',
  'Bodega amplia con excelente acceso vehicular.',
  'Bodega industrial de 500m² con altura de 8 metros. Oficina administrativa incluida.',
  'arriendo', 'bodega', 15000000, 'COP',
  'Bogotá', 'Puente Aranda', 'Carrera 50 # 12-30',
  0, 2, 0, 500, 500, NULL, NULL, 1,
  ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
  ARRAY['Oficina', 'Baños', 'Patio de maniobras', 'Vigilancia', 'Altura 8m'],
  false, true, 'approved', 'SAMPLE-008'
),

-- 9. Apartaestudio en Cedritos
(
  'apartaestudio-cedritos-bogota',
  'Apartaestudio Moderno en Cedritos',
  'Perfecto para estudiantes o solteros, excelente ubicación.',
  'Apartaestudio de 45m² completamente amoblado y equipado. Cerca de transporte público.',
  'arriendo', 'apartamento', 1800000, 'COP',
  'Bogotá', 'Cedritos', 'Calle 140 # 13-25',
  1, 1, 0, 45, 45, 4, 5, 12,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
  ARRAY['Amoblado', 'Gimnasio comunal', 'Lavandería', 'Portería 24h'],
  false, true, 'approved', 'SAMPLE-009'
),

-- 10. Lote en La Calera
(
  'lote-la-calera-cundinamarca',
  'Lote con Vista Espectacular en La Calera',
  'Lote para construir tu casa de ensueño con vista a Bogotá.',
  'Lote de 2500m² con vista panorámica hacia Bogotá. Servicios de agua y luz disponibles.',
  'venta', 'lote', 380000000, 'COP',
  'La Calera', 'Alto del Águila', 'Km 4 Vía La Calera',
  0, 0, 0, 2500, NULL, NULL, NULL, NULL,
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  ARRAY['Vista panorámica', 'Servicios públicos', 'Vías pavimentadas', 'Vigilancia'],
  false, true, 'approved', 'SAMPLE-010'
)

ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STEP 8: Verify results
-- =====================================================
SELECT
  reference_code,
  title,
  property_type,
  city,
  TO_CHAR(price, 'FM$999,999,999,999') as precio,
  is_featured as destacado
FROM properties
WHERE is_active = true
ORDER BY reference_code;
