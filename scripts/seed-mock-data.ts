/**
 * Script para insertar datos mock en Supabase
 * Ejecutar con: npx tsx scripts/seed-mock-data.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ==========================================
// MOCK AGENTS DATA
// ==========================================
const MOCK_AGENTS = [
  {
    slug: 'maria-garcia',
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'maria.garcia@redbot-realestate.com',
    phone: '+57 300 123 4567',
    bio: 'Con mas de 10 anos de experiencia en el mercado inmobiliario de Bogota y Medellin, Maria se especializa en propiedades de lujo y atencion personalizada. Su conocimiento profundo del mercado y su dedicacion a sus clientes la han convertido en una de las agentes mas solicitadas de la region.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    role: 'Agente Senior de Bienes Raices',
    specialties: ['Propiedades de Lujo', 'Apartamentos', 'Bogota'],
    languages: ['Español', 'Ingles'],
    social_links: {
      facebook: 'https://facebook.com/mariagarcia',
      instagram: 'https://instagram.com/mariagarcia_realestate',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      whatsapp: 'https://wa.me/573001234567',
    },
    is_active: true,
  },
  {
    slug: 'carlos-rodriguez',
    first_name: 'Carlos',
    last_name: 'Rodriguez',
    email: 'carlos.rodriguez@redbot-realestate.com',
    phone: '+57 310 987 6543',
    bio: 'Carlos es experto en inversiones inmobiliarias y propiedades comerciales. Su enfoque analitico y su amplia red de contactos le permiten encontrar las mejores oportunidades para sus clientes inversionistas.',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    role: 'Especialista en Inversiones',
    specialties: ['Inversiones', 'Propiedades Comerciales', 'Medellin'],
    languages: ['Español'],
    social_links: {
      linkedin: 'https://linkedin.com/in/carlosrodriguez',
      instagram: 'https://instagram.com/carlos_inversiones',
    },
    is_active: true,
  },
  {
    slug: 'ana-martinez',
    first_name: 'Ana',
    last_name: 'Martinez',
    email: 'ana.martinez@redbot-realestate.com',
    phone: '+57 315 456 7890',
    bio: 'Ana se especializa en ayudar a familias a encontrar el hogar perfecto. Su calidez y atencion al detalle hacen que el proceso de compra sea una experiencia memorable.',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    role: 'Consultora de Propiedades Residenciales',
    specialties: ['Residencial', 'Familias', 'Cartagena'],
    languages: ['Español', 'Ingles'],
    social_links: {
      instagram: 'https://instagram.com/ana_hogares',
      facebook: 'https://facebook.com/anamartinezrealestate',
    },
    is_active: true,
  },
  {
    slug: 'david-lopez',
    first_name: 'David',
    last_name: 'Lopez',
    email: 'david.lopez@redbot-realestate.com',
    phone: '+57 320 111 2233',
    bio: 'David conoce cada rincon de la costa colombiana. Especializado en propiedades frente al mar y desarrollos turisticos.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    role: 'Agente de Propiedades de Playa',
    specialties: ['Propiedades de Playa', 'Turismo', 'Santa Marta'],
    languages: ['Español'],
    social_links: {
      instagram: 'https://instagram.com/david_playarealestate',
    },
    is_active: true,
  },
];

// ==========================================
// MOCK PROPERTIES DATA
// ==========================================
const MOCK_PROPERTIES = [
  {
    slug: 'apartamento-moderno-chapinero',
    title: 'Apartamento Moderno en Chapinero Alto',
    description_short: 'Hermoso apartamento con vista a la ciudad y acabados de lujo.',
    description: `Este espectacular apartamento de 120m² en el corazon de Chapinero Alto ofrece una combinacion perfecta de modernidad y comodidad.

Con 3 amplias habitaciones, 2 banos completos y una terraza con vista panoramica a los cerros orientales, esta propiedad es ideal para familias o profesionales que buscan calidad de vida en una de las zonas mas exclusivas de Bogota.

La cocina tipo americano cuenta con electrodomesticos de alta gama y mesones en cuarzo. Los pisos en porcelanato de gran formato y la iluminacion LED empotrada crean un ambiente sofisticado y acogedor.

El edificio cuenta con gimnasio, salon social, parqueadero cubierto y seguridad 24 horas.`,
    status: 'venta',
    property_type: 'apartamento',
    is_featured: true,
    is_active: true,
    price: 850000000,
    price_currency: 'COP',
    address: 'Calle 70 #11-30',
    city: 'Bogota',
    neighborhood: 'Chapinero Alto',
    latitude: 4.6486,
    longitude: -74.0628,
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 2,
    area_m2: 120,
    year_built: 2021,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    ],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    amenities: ['gimnasio', 'piscina', 'seguridad_24_7', 'ascensor', 'terraza', 'aire_acondicionado'],
    agent_slug: 'maria-garcia',
  },
  {
    slug: 'casa-campestre-chia',
    title: 'Casa Campestre con Jardin en Chia',
    description_short: 'Espectacular casa con amplios espacios verdes y vista a las montanas.',
    description: `Descubre esta increible casa campestre de 280m² construidos en un lote de 500m² ubicada en uno de los conjuntos mas exclusivos de Chia.

La propiedad cuenta con 4 habitaciones, cada una con bano privado, sala de estar con chimenea, comedor independiente, cocina integral con isla central y cuarto de servicio con bano.

El amplio jardin con zonas verdes es perfecto para familias con ninos o mascotas. Incluye BBQ cubierto, garaje para 3 vehiculos y bodega.

El conjunto ofrece vigilancia 24 horas, canchas de tenis y zona de juegos infantiles.`,
    status: 'venta',
    property_type: 'casa',
    is_featured: true,
    is_active: true,
    price: 1500000000,
    price_currency: 'COP',
    city: 'Chia',
    neighborhood: 'Sindamanoy',
    latitude: 4.8637,
    longitude: -74.0351,
    bedrooms: 4,
    bathrooms: 4,
    parking_spots: 3,
    area_m2: 280,
    year_built: 2019,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
    ],
    amenities: ['jardin', 'bbq', 'garaje', 'chimenea', 'seguridad_24_7', 'cancha_de_tenis'],
    agent_slug: 'carlos-rodriguez',
  },
  {
    slug: 'penthouse-poblado',
    title: 'Penthouse de Lujo en El Poblado',
    description_short: 'Exclusivo penthouse con terraza privada y vista panoramica de la ciudad.',
    description: `Vive el lujo en su maxima expresion en este espectacular penthouse de 350m² en el exclusivo sector de El Poblado, Medellin.

Con 4 habitaciones, 4 banos y medio, este penthouse ofrece vistas de 360 grados a la ciudad. La terraza privada de 80m² incluye jacuzzi, zona de BBQ y lounge.

Acabados de primera calidad: pisos en marmol italiano, cocina Italiana con electrodomesticos Miele, domotica completa y sistema de sonido Bose integrado.

2 parqueaderos privados + deposito. Edificio con piscina climatizada, spa, gimnasio premium y salon de eventos.`,
    status: 'venta',
    property_type: 'apartamento',
    is_featured: true,
    is_active: true,
    price: 2800000000,
    price_currency: 'COP',
    city: 'Medellin',
    neighborhood: 'El Poblado',
    latitude: 6.2088,
    longitude: -75.5660,
    bedrooms: 4,
    bathrooms: 5,
    parking_spots: 2,
    area_m2: 350,
    year_built: 2023,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    ],
    amenities: ['terraza', 'jacuzzi', 'vista_panoramica', 'gimnasio', 'piscina', 'seguridad_24_7', 'ascensor'],
    agent_slug: 'maria-garcia',
  },
  {
    slug: 'apartamento-bocagrande',
    title: 'Apartamento Frente al Mar en Bocagrande',
    description_short: 'Increible apartamento con vista directa al mar Caribe.',
    description: `Despierta cada manana con la brisa del mar en este hermoso apartamento de 95m² ubicado en primera linea de playa en Bocagrande, Cartagena.

2 habitaciones con aire acondicionado, 2 banos completos, sala-comedor con balcon y vista al mar. Cocina integral equipada.

Ideal para vacaciones o renta corta. El edificio cuenta con piscina, acceso directo a la playa, gimnasio y porteria 24 horas.

A pocos minutos del centro historico, restaurantes y centros comerciales.`,
    status: 'arriendo',
    property_type: 'apartamento',
    is_featured: true,
    is_active: true,
    price: 15000000,
    price_currency: 'COP',
    city: 'Cartagena',
    neighborhood: 'Bocagrande',
    latitude: 10.3997,
    longitude: -75.5547,
    bedrooms: 2,
    bathrooms: 2,
    parking_spots: 1,
    area_m2: 95,
    year_built: 2018,
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    ],
    amenities: ['piscina', 'playa', 'gimnasio', 'aire_acondicionado', 'balcon', 'seguridad_24_7'],
    agent_slug: 'ana-martinez',
  },
  {
    slug: 'villa-santa-marta',
    title: 'Villa de Lujo con Piscina Privada',
    description_short: 'Espectacular villa con vistas al mar y todas las comodidades.',
    description: `Villa exclusiva de 400m² en lote de 1200m² ubicada en las colinas de Santa Marta con vistas impresionantes al mar Caribe.

5 habitaciones en suite, sala principal con techos dobles, comedor para 12 personas, cocina gourmet con isla, cuarto de servicio independiente.

Piscina infinita privada, jardin tropical, gazebo con BBQ, garaje para 4 vehiculos. Casa inteligente con sistema de seguridad y camaras.`,
    status: 'venta',
    property_type: 'casa',
    is_featured: true,
    is_active: true,
    price: 3500000000,
    price_currency: 'COP',
    city: 'Santa Marta',
    neighborhood: 'Pozos Colorados',
    latitude: 11.2274,
    longitude: -74.1842,
    bedrooms: 5,
    bathrooms: 5,
    parking_spots: 4,
    area_m2: 400,
    year_built: 2022,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
    ],
    amenities: ['piscina', 'vista_panoramica', 'jardin', 'bbq', 'seguridad_24_7', 'garaje'],
    agent_slug: 'david-lopez',
  },
  {
    slug: 'oficina-centro-empresarial',
    title: 'Oficina en Centro Empresarial Premium',
    description_short: 'Oficina moderna en el mejor centro empresarial de Bogota.',
    description: `Oficina de 150m² en el prestigioso Centro Empresarial Santa Barbara, zona empresarial por excelencia de Bogota.

Espacio diafano con posibilidad de distribucion flexible. Cuenta con recepcion, 4 oficinas privadas, sala de juntas con capacidad para 10 personas, cocineta y 2 banos.

El edificio ofrece lobby de doble altura, ascensores de alta velocidad, parqueaderos de visitantes, cafeteria, y esta certificado LEED.

Excelente conectividad vial y cercano a estacion de TransMilenio.`,
    status: 'arriendo',
    property_type: 'oficina',
    is_featured: false,
    is_active: true,
    price: 8500000,
    price_currency: 'COP',
    city: 'Bogota',
    neighborhood: 'Santa Barbara',
    latitude: 4.6965,
    longitude: -74.0329,
    bedrooms: 0,
    bathrooms: 2,
    parking_spots: 3,
    area_m2: 150,
    year_built: 2020,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200',
    ],
    amenities: ['ascensor', 'seguridad_24_7', 'aire_acondicionado', 'internet_wifi'],
    agent_slug: 'carlos-rodriguez',
  },
  {
    slug: 'apartamento-laureles',
    title: 'Apartamento Acogedor en Laureles',
    description_short: 'Apartamento perfecto para vivir en el mejor barrio de Medellin.',
    description: `Hermoso apartamento de 85m² en el tradicional barrio Laureles de Medellin. Zona tranquila, arborizada y con excelente vida de barrio.

3 habitaciones, 2 banos, sala-comedor con balcon, cocina semi-integral. Piso 5 con ascensor.

Cerca de La 70, restaurantes, bares, supermercados y estacion del Metro. Ideal para profesionales o parejas jovenes.`,
    status: 'venta',
    property_type: 'apartamento',
    is_featured: false,
    is_active: true,
    price: 420000000,
    price_currency: 'COP',
    city: 'Medellin',
    neighborhood: 'Laureles',
    latitude: 6.2469,
    longitude: -75.5913,
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 1,
    area_m2: 85,
    year_built: 2015,
    images: [
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
    ],
    amenities: ['ascensor', 'balcon', 'seguridad_24_7'],
    agent_slug: 'carlos-rodriguez',
  },
  {
    slug: 'casa-usaquen',
    title: 'Casa Colonial Restaurada en Usaquen',
    description_short: 'Hermosa casa colonial con encanto historico y comodidades modernas.',
    description: `Unica oportunidad de adquirir una casa colonial de 1920 completamente restaurada en el corazon de Usaquen.

220m² construidos en 2 plantas. 4 habitaciones, 3 banos, patio interior con fuente, sala con chimenea original, comedor con techos en madera.

Combina el encanto de la arquitectura colonial con acabados contemporaneos y todas las comodidades modernas. Zona historica, restaurantes y galerias a pasos.`,
    status: 'venta',
    property_type: 'casa',
    is_featured: false,
    is_active: true,
    price: 1850000000,
    price_currency: 'COP',
    city: 'Bogota',
    neighborhood: 'Usaquen',
    latitude: 4.6952,
    longitude: -74.0312,
    bedrooms: 4,
    bathrooms: 3,
    parking_spots: 0,
    area_m2: 220,
    year_built: 1920,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    ],
    amenities: ['chimenea', 'jardin', 'pisos_de_madera', 'techos_altos'],
    agent_slug: 'maria-garcia',
  },
  {
    slug: 'local-comercial-zona-rosa',
    title: 'Local Comercial en Zona Rosa',
    description_short: 'Excelente local en la mejor zona comercial de Bogota.',
    description: `Local comercial de 180m² ubicado en la Zona Rosa de Bogota, la zona de mayor afluencia comercial y turistica de la ciudad.

Espacio en esquina con doble vitrina, ideal para restaurante, boutique o showroom. Cuenta con mezanine de 50m² adicionales, bano privado y cocina basica.

Zona con alto flujo peatonal las 24 horas. Cerca del Parque de la 93 y centros comerciales.`,
    status: 'arriendo',
    property_type: 'local',
    is_featured: false,
    is_active: true,
    price: 25000000,
    price_currency: 'COP',
    city: 'Bogota',
    neighborhood: 'Zona Rosa',
    latitude: 4.6670,
    longitude: -74.0523,
    bedrooms: 0,
    bathrooms: 1,
    parking_spots: 0,
    area_m2: 180,
    year_built: 2010,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    ],
    amenities: ['seguridad_24_7', 'aire_acondicionado'],
    agent_slug: 'carlos-rodriguez',
  },
  {
    slug: 'duplex-envigado',
    title: 'Duplex Moderno en Envigado',
    description_short: 'Duplex de diseno contemporaneo con excelentes acabados.',
    description: `Moderno duplex de 160m² en conjunto cerrado de Envigado. Arquitectura contemporanea con amplios espacios y luz natural.

Primer nivel: sala de doble altura, comedor, cocina abierta tipo isla, bano social, estudio. Segundo nivel: habitacion principal con walking closet y bano completo, 2 habitaciones adicionales con bano compartido.

Terraza privada de 25m², 2 parqueaderos cubiertos. Conjunto con piscina, gimnasio y salon social.`,
    status: 'venta',
    property_type: 'apartamento',
    is_featured: false,
    is_active: true,
    price: 680000000,
    price_currency: 'COP',
    city: 'Envigado',
    neighborhood: 'Zuñiga',
    latitude: 6.1739,
    longitude: -75.5866,
    bedrooms: 3,
    bathrooms: 3,
    parking_spots: 2,
    area_m2: 160,
    year_built: 2022,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
    ],
    amenities: ['piscina', 'gimnasio', 'terraza', 'walking_closet', 'seguridad_24_7'],
    agent_slug: 'carlos-rodriguez',
  },
];

// ==========================================
// MOCK TESTIMONIALS DATA
// ==========================================
const MOCK_TESTIMONIALS = [
  {
    name: 'Andrea Fernandez',
    role: 'Compradora - Empresaria',
    content: 'Excelente servicio! Maria me ayudo a encontrar el apartamento perfecto en Chapinero. Su conocimiento del mercado y su paciencia hicieron que todo el proceso fuera muy facil. Altamente recomendada.',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    rating: 5,
    is_featured: true,
    is_active: true,
    display_order: 1,
  },
  {
    name: 'Roberto Mendez',
    role: 'Inversionista - Grupo Mendez S.A.S',
    content: 'Como inversionista, valoro mucho la asesoria de Carlos. Ha identificado propiedades con excelente potencial de valorizacion. En 3 anos, mi portafolio ha crecido significativamente gracias a sus recomendaciones.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    name: 'Lucia Ramirez',
    role: 'Vendedora - Arquitecta',
    content: 'Vendi mi casa en tiempo record y a un precio excelente. El equipo de Redbot manejo todo profesionalmente, desde las fotos hasta el cierre. Super agradecida por su dedicacion.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    rating: 5,
    is_featured: true,
    is_active: true,
    display_order: 3,
  },
  {
    name: 'Felipe Torres',
    role: 'Arrendatario - Ingeniero de Software',
    content: 'Encontre el apartamento ideal para arrendar cerca de mi trabajo. El proceso fue muy agil y transparente. Ana fue muy profesional y siempre estuvo disponible para resolver mis dudas.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    rating: 4,
    is_featured: false,
    is_active: true,
    display_order: 4,
  },
  {
    name: 'Carmen Jimenez',
    role: 'Compradora - Medica',
    content: 'Compre mi primera vivienda con Redbot y fue una experiencia increible. Me guiaron en cada paso, desde la busqueda hasta la firma de escrituras. El equipo es muy profesional y humano.',
    avatar_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200',
    rating: 5,
    is_featured: true,
    is_active: true,
    display_order: 5,
  },
];

// ==========================================
// MOCK BLOG POSTS DATA
// ==========================================
const MOCK_BLOG_POSTS = [
  {
    slug: 'guia-comprar-primera-vivienda-colombia',
    title: 'Guia Completa para Comprar tu Primera Vivienda en Colombia',
    excerpt: 'Todo lo que necesitas saber antes de dar el gran paso: financiacion, documentos, subsidios y consejos de expertos para comprar tu primer hogar.',
    content: `# Guia Completa para Comprar tu Primera Vivienda en Colombia

Comprar tu primera vivienda es uno de los pasos mas importantes en la vida. En Colombia, existen multiples opciones y beneficios que pueden ayudarte a hacer realidad este sueno.

## 1. Evalua tu Capacidad Financiera

Antes de comenzar la busqueda, es fundamental conocer tu capacidad de endeudamiento:
- Revisa tu historial crediticio
- Calcula el 30% de tus ingresos como cuota maxima
- Considera gastos adicionales (escrituras, impuestos, avaluo)

## 2. Conoce los Subsidios Disponibles

El gobierno colombiano ofrece varios programas:
- Mi Casa Ya: Subsidio a la tasa de interes
- Semillero de Propietarios: Para arrendatarios que quieren comprar
- Frech: Subsidio a la cuota inicial

## 3. Documentacion Necesaria

Prepara con anticipacion:
- Cedula de ciudadania
- Certificado laboral
- Ultimos 3 extractos bancarios
- Declaracion de renta (si aplica)

## 4. El Proceso de Compra

1. Busqueda de la propiedad
2. Oferta de compra
3. Estudio de titulos
4. Solicitud de credito hipotecario
5. Firma de promesa de compraventa
6. Desembolso y escrituracion

Con la asesoria correcta, comprar vivienda puede ser un proceso sencillo y seguro.`,
    featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    author_name: 'Maria Garcia',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    category: 'Guias',
    tags: ['compra', 'primera vivienda', 'financiacion', 'subsidios'],
    is_published: true,
    published_at: '2024-01-20T10:00:00Z',
  },
  {
    slug: 'tendencias-mercado-inmobiliario-2024',
    title: 'Tendencias del Mercado Inmobiliario en Colombia 2024',
    excerpt: 'Analisis de las principales tendencias que estan marcando el sector inmobiliario este ano: precios, zonas emergentes y oportunidades de inversion.',
    content: `# Tendencias del Mercado Inmobiliario en Colombia 2024

El mercado inmobiliario colombiano continua evolucionando. Estas son las principales tendencias que observamos este ano.

## Zonas de Mayor Valorizacion

- **Bogota**: Chapinero, Usaquen y la expansion hacia el norte
- **Medellin**: El Poblado sigue fuerte, pero emergen zonas como Laureles
- **Costa Caribe**: Barranquilla y Santa Marta con crecimiento sostenido

## Tipos de Propiedad en Demanda

Los apartamentos compactos (45-70 m2) lideran las ventas, seguidos por propiedades con espacios de home office.

## Inversion Extranjera

El interes de compradores internacionales sigue en aumento, especialmente de Estados Unidos y Europa.`,
    featured_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    author_name: 'Carlos Rodriguez',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    category: 'Mercado',
    tags: ['tendencias', 'inversion', '2024', 'analisis'],
    is_published: true,
    published_at: '2024-01-15T09:00:00Z',
  },
  {
    slug: 'como-aumentar-valor-propiedad',
    title: 'Como Aumentar el Valor de tu Propiedad Antes de Vender',
    excerpt: 'Consejos practicos y renovaciones estrategicas que pueden incrementar significativamente el valor de tu inmueble en el mercado.',
    content: `# Como Aumentar el Valor de tu Propiedad Antes de Vender

Pequenas mejoras pueden generar grandes retornos al momento de vender. Aqui te compartimos las mas efectivas.

## Renovaciones con Mayor Retorno

1. **Cocina**: Actualizar gabinetes y encimeras
2. **Banos**: Modernizar griferias y acabados
3. **Pintura**: Colores neutros y frescos
4. **Pisos**: Cambiar a laminados o porcelanato

## Mejoras Exteriores

El primer impacto cuenta. Invierte en:
- Fachada limpia y pintada
- Jardineria cuidada
- Iluminacion exterior

## Home Staging

Preparar tu propiedad para las visitas puede acelerar la venta y mejorar el precio hasta un 10%.`,
    featured_image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    author_name: 'Ana Martinez',
    author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    category: 'Consejos',
    tags: ['venta', 'renovacion', 'valorizacion', 'consejos'],
    is_published: true,
    published_at: '2024-01-10T14:00:00Z',
  },
  {
    slug: 'invertir-finca-raiz-vs-otras-opciones',
    title: 'Invertir en Finca Raiz vs Otras Opciones de Inversion',
    excerpt: 'Comparativa detallada entre inversion inmobiliaria y otras alternativas como acciones, CDTs y fondos de inversion.',
    content: `# Invertir en Finca Raiz vs Otras Opciones de Inversion

La inversion inmobiliaria ha sido tradicionalmente una de las mas seguras en Colombia. Veamos como se compara.

## Ventajas de la Finca Raiz

- Activo tangible y real
- Generacion de renta pasiva
- Proteccion contra la inflacion
- Valorizacion historica del 5-8% anual

## Comparativa de Retornos

| Inversion | Retorno Anual Promedio |
|-----------|----------------------|
| Finca Raiz | 8-12% |
| CDT | 7-9% |
| Acciones | Variable |
| Fondos | 6-10% |

## Consideraciones Importantes

La finca raiz requiere mayor capital inicial pero ofrece estabilidad y multiples formas de rentabilizar.`,
    featured_image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800',
    author_name: 'Carlos Rodriguez',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    category: 'Inversion',
    tags: ['inversion', 'finanzas', 'comparativa', 'rentabilidad'],
    is_published: true,
    published_at: '2024-01-05T11:00:00Z',
  },
];

// ==========================================
// MOCK PROJECTS DATA
// ==========================================
const MOCK_PROJECTS = [
  {
    slug: 'torres-del-parque-chapinero',
    name: 'Torres del Parque Chapinero',
    developer: 'Constructora Elite',
    description_short: 'Exclusivo proyecto residencial con vista a los cerros orientales y acabados de lujo.',
    description: `Torres del Parque Chapinero es el nuevo proyecto insignia de Constructora Élite, ubicado en el corazón de Chapinero Alto.

Este desarrollo de 2 torres de 25 pisos cada una ofrece apartamentos desde 65m² hasta 180m², diseñados con los más altos estándares de calidad y acabados premium.

**Características del proyecto:**
- Lobby con doble altura y diseño contemporáneo
- Gimnasio completamente equipado
- Piscina climatizada
- Terraza BBQ en el último piso con vista 360°
- Salón de coworking
- Zona de niños
- Parqueaderos con cargadores para vehículos eléctricos`,
    status: 'en_construccion',
    city: 'Bogota',
    neighborhood: 'Chapinero Alto',
    address: 'Carrera 7 #70-40',
    latitude: 4.6486,
    longitude: -74.0628,
    price_from: 450000000,
    price_to: 1200000000,
    total_units: 180,
    available_units: 45,
    unit_types: ['1 Habitacion', '2 Habitaciones', '3 Habitaciones', 'Penthouse'],
    area_from: 65,
    area_to: 180,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    ],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    amenities: ['piscina', 'gimnasio', 'bbq', 'salon_comunal', 'coworking', 'parqueadero_visitantes', 'seguridad_24_7'],
    is_featured: true,
    is_active: true,
    completion_date: '2025-12-01',
  },
  {
    slug: 'mirador-de-santa-fe',
    name: 'Mirador de Santa Fe',
    developer: 'Grupo Inmobiliario Costa',
    description_short: 'Proyecto sobre planos en la zona más exclusiva de Santa Marta con vista al mar.',
    description: `Mirador de Santa Fe es un exclusivo proyecto frente al mar Caribe.

Con 120 unidades distribuidas en 3 torres de 12 pisos, este proyecto ofrece apartamentos con espectaculares vistas al mar y a la Sierra Nevada de Santa Marta.

**Características únicas:**
- Acceso directo a playa privada
- Infinity pool con vista al mar
- Beach club exclusivo para residentes
- Spa y wellness center`,
    status: 'preventa',
    city: 'Santa Marta',
    neighborhood: 'Pozos Colorados',
    latitude: 11.1986,
    longitude: -74.1897,
    price_from: 850000000,
    price_to: 3500000000,
    total_units: 120,
    available_units: 95,
    unit_types: ['2 Habitaciones', '3 Habitaciones', 'Penthouse'],
    area_from: 90,
    area_to: 280,
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    ],
    amenities: ['piscina', 'playa', 'gimnasio', 'spa', 'restaurante', 'seguridad_24_7', 'jacuzzi'],
    is_featured: true,
    is_active: true,
    completion_date: '2026-12-01',
  },
  {
    slug: 'centro-empresarial-poblado',
    name: 'Centro Empresarial El Poblado',
    developer: 'Inversiones Antioquia S.A.',
    description_short: 'Moderno edificio de oficinas AAA en la zona financiera de Medellín.',
    description: `Centro Empresarial El Poblado es el nuevo referente de oficinas premium en Medellín.

Edificio de 18 pisos con certificación LEED Gold, diseñado para empresas que buscan espacios modernos, eficientes y sostenibles.`,
    status: 'en_construccion',
    city: 'Medellin',
    neighborhood: 'El Poblado',
    address: 'Carrera 43A #1-50',
    latitude: 6.2087,
    longitude: -75.5697,
    price_from: 180000000,
    price_to: 1500000000,
    total_units: 85,
    available_units: 32,
    unit_types: ['Oficina 50m²', 'Oficina 100m²', 'Oficina 200m²', 'Piso Completo'],
    area_from: 45,
    area_to: 450,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    ],
    amenities: ['ascensor', 'seguridad_24_7', 'aire_acondicionado', 'parqueadero_visitantes'],
    is_featured: true,
    is_active: true,
    completion_date: '2025-06-01',
  },
];

// ==========================================
// MAIN SEED FUNCTION
// ==========================================
async function main() {
  console.log('\n🌱 Iniciando seed de datos mock a Supabase...\n');

  // 1. Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Limpiando datos existentes...');
  await supabase.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('agents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('   ✅ Datos limpiados\n');

  // 2. Insert Agents
  console.log('👥 Insertando agentes...');
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .insert(MOCK_AGENTS)
    .select();

  if (agentsError) {
    console.error('   ❌ Error:', agentsError.message);
  } else {
    console.log(`   ✅ ${agents?.length} agentes insertados`);
  }

  // Create agent slug -> id map
  const agentMap = new Map<string, string>();
  agents?.forEach((agent) => {
    agentMap.set(agent.slug, agent.id);
  });

  // 3. Insert Properties with agent_id
  console.log('\n🏠 Insertando propiedades...');
  const propertiesWithAgentId = MOCK_PROPERTIES.map((p) => {
    const { agent_slug, ...rest } = p;
    return {
      ...rest,
      agent_id: agent_slug ? agentMap.get(agent_slug) : null,
    };
  });

  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .insert(propertiesWithAgentId)
    .select();

  if (propertiesError) {
    console.error('   ❌ Error:', propertiesError.message);
  } else {
    console.log(`   ✅ ${properties?.length} propiedades insertadas`);
  }

  // 4. Insert Testimonials
  console.log('\n💬 Insertando testimonios...');
  const { data: testimonials, error: testimonialsError } = await supabase
    .from('testimonials')
    .insert(MOCK_TESTIMONIALS)
    .select();

  if (testimonialsError) {
    console.error('   ❌ Error:', testimonialsError.message);
  } else {
    console.log(`   ✅ ${testimonials?.length} testimonios insertados`);
  }

  // 5. Insert Blog Posts
  console.log('\n📝 Insertando blog posts...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .insert(MOCK_BLOG_POSTS)
    .select();

  if (blogError) {
    console.error('   ❌ Error:', blogError.message);
  } else {
    console.log(`   ✅ ${blogPosts?.length} blog posts insertados`);
  }

  // 6. Insert Projects
  console.log('\n🏗️  Insertando proyectos...');
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .insert(MOCK_PROJECTS)
    .select();

  if (projectsError) {
    console.error('   ❌ Error:', projectsError.message);
  } else {
    console.log(`   ✅ ${projects?.length} proyectos insertados`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN');
  console.log('='.repeat(50));
  console.log(`   Agentes: ${agents?.length || 0}`);
  console.log(`   Propiedades: ${properties?.length || 0}`);
  console.log(`   Testimonios: ${testimonials?.length || 0}`);
  console.log(`   Blog Posts: ${blogPosts?.length || 0}`);
  console.log(`   Proyectos: ${projects?.length || 0}`);
  console.log('='.repeat(50));
  console.log('\n✅ Seed completado!\n');
}

main().catch(console.error);
