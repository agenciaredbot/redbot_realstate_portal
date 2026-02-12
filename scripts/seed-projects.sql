-- Seed Projects for Redbot Real Estate Portal
-- Run this SQL in Supabase SQL Editor to insert mock data

INSERT INTO projects (
  slug, name, developer, description_short, description,
  status, city, neighborhood, address, latitude, longitude,
  price_from, price_to, price_currency,
  total_units, available_units, unit_types, area_from, area_to,
  images, logo_url, video_url, brochure_url, amenities,
  is_featured, is_active, completion_date
) VALUES
-- Proyecto 1: Torres del Parque Chapinero
(
  'torres-del-parque-chapinero',
  'Torres del Parque Chapinero',
  'Constructora Elite',
  'Exclusivo proyecto residencial con vista a los cerros orientales y acabados de lujo.',
  'Torres del Parque Chapinero es el nuevo proyecto insignia de Constructora Elite, ubicado en una de las zonas mas exclusivas de Bogota. Con 180 apartamentos distribuidos en dos elegantes torres de 25 pisos, este desarrollo ofrece una experiencia de vida unica.

Cada unidad ha sido disenada pensando en el maximo confort, con amplios espacios, acabados de primera calidad y vistas panoramicas a los cerros orientales. El proyecto cuenta con una completa zona social que incluye piscina climatizada, gimnasio equipado, salon comunal, zona BBQ, coworking y parque infantil.

La ubicacion privilegiada permite facil acceso a centros comerciales, restaurantes, colegios y universidades, asi como excelente conectividad con las principales vias de la ciudad.',
  'en_construccion',
  'Bogota',
  'Chapinero Alto',
  'Carrera 7 #70-40',
  4.6486,
  -74.0628,
  450000000,
  1200000000,
  'COP',
  180,
  45,
  ARRAY['1 Habitacion', '2 Habitaciones', '3 Habitaciones', 'Penthouse'],
  65,
  180,
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200'],
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  NULL,
  ARRAY['piscina', 'gimnasio', 'bbq', 'salon_comunal', 'coworking', 'seguridad_24_7', 'parqueadero_visitantes', 'zona_infantil'],
  true,
  true,
  '2025-12-01'
),

-- Proyecto 2: Oceano Living Cartagena
(
  'oceano-living-cartagena',
  'Oceano Living Cartagena',
  'Grupo Inmobiliario Caribe',
  'Vive frente al mar en el proyecto mas exclusivo de la costa colombiana.',
  'Oceano Living Cartagena redefine el concepto de vida frente al mar. Ubicado en la exclusiva zona de Bocagrande, este desarrollo de 120 apartamentos ofrece acceso directo a la playa y vistas inigualables al Mar Caribe.

El proyecto cuenta con amenidades de clase mundial: piscina infinity con vista al oceano, spa completo, restaurante gourmet, gimnasio panoramico, club de playa privado y servicio de concierge 24/7. Los apartamentos van desde acogedores estudios hasta lujosos penthouses de 4 habitaciones.

Ideal tanto para vivir como para invertir, con un programa de renta garantizada que asegura retornos atractivos. Entrega estimada para el segundo semestre de 2026.',
  'preventa',
  'Cartagena',
  'Bocagrande',
  'Avenida San Martin #10-50',
  10.4007,
  -75.5551,
  380000000,
  2500000000,
  'COP',
  120,
  98,
  ARRAY['Estudio', '1 Habitacion', '2 Habitaciones', '3 Habitaciones', '4 Habitaciones', 'Penthouse'],
  45,
  320,
  ARRAY['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200'],
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  NULL,
  ARRAY['piscina', 'gimnasio', 'spa', 'salon_comunal', 'seguridad_24_7', 'parqueadero_visitantes', 'porteria', 'ascensor'],
  true,
  true,
  '2026-06-01'
),

-- Proyecto 3: Bosques de la Calera
(
  'bosques-de-la-calera',
  'Bosques de la Calera',
  'Verde Construcciones',
  'Casas campestres de lujo rodeadas de naturaleza, a solo 20 minutos de Bogota.',
  'Bosques de la Calera es un exclusivo proyecto de casas campestres que combina el lujo con la tranquilidad de vivir en medio de la naturaleza. A tan solo 20 minutos de Bogota, este desarrollo ofrece la oportunidad de escapar del ruido de la ciudad sin alejarse de ella.

El proyecto consta de 40 casas independientes con lotes desde 1000 m2, cada una disenada para integrarse armonicamente con el entorno natural. Las viviendas cuentan con amplios jardines, terrazas panoramicas y acabados de alta especificacion.

La zona comun incluye club house con piscina, senderos ecologicos, huerta organica comunitaria, salon de eventos y cancha de tenis. Un lugar perfecto para familias que buscan calidad de vida.',
  'entrega_inmediata',
  'La Calera',
  'Vereda San Jose',
  'Km 5 Via La Calera',
  4.7166,
  -73.9700,
  1200000000,
  2800000000,
  'COP',
  40,
  8,
  ARRAY['3 Habitaciones', '4 Habitaciones'],
  280,
  450,
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200'],
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
  NULL,
  NULL,
  ARRAY['piscina', 'gimnasio', 'bbq', 'salon_comunal', 'seguridad_24_7', 'senderos', 'zona_infantil', 'cancha_tenis'],
  true,
  true,
  '2024-06-01'
);

-- Verificar insercion
SELECT id, name, city, status, is_active, is_featured FROM projects ORDER BY created_at DESC;
