import type { Property, Agent, Testimonial, BlogPost, Project } from '@/types';

// ==========================================
// MOCK AGENTS
// ==========================================
export const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    slug: 'maria-garcia',
    first_name: 'Maria',
    last_name: 'Garcia',
    full_name: 'Maria Garcia',
    email: 'maria.garcia@redbot-realestate.com',
    phone: '+57 300 123 4567',
    whatsapp: '+57 300 123 4567',
    title: 'Agente Senior de Bienes Raices',
    bio: 'Con mas de 10 anos de experiencia en el mercado inmobiliario de Bogota y Medellin, Maria se especializa en propiedades de lujo y atencion personalizada. Su conocimiento profundo del mercado y su dedicacion a sus clientes la han convertido en una de las agentes mas solicitadas de la region.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    city: 'Bogota',
    office_address: 'Calle 100 #19-61, Oficina 1001',
    social_links: {
      facebook: 'https://facebook.com/mariagarcia',
      instagram: 'https://instagram.com/mariagarcia_realestate',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      whatsapp: 'https://wa.me/573001234567',
    },
    properties_count: 24,
    sales_count: 156,
    rating: 4.9,
    reviews_count: 89,
    is_active: true,
    created_at: '2020-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'carlos-rodriguez',
    first_name: 'Carlos',
    last_name: 'Rodriguez',
    full_name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@redbot-realestate.com',
    phone: '+57 310 987 6543',
    whatsapp: '+57 310 987 6543',
    title: 'Especialista en Inversiones',
    bio: 'Carlos es experto en inversiones inmobiliarias y propiedades comerciales. Su enfoque analitico y su amplia red de contactos le permiten encontrar las mejores oportunidades para sus clientes inversionistas.',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    city: 'Medellin',
    office_address: 'Carrera 43A #1-50, El Poblado',
    social_links: {
      linkedin: 'https://linkedin.com/in/carlosrodriguez',
      instagram: 'https://instagram.com/carlos_inversiones',
    },
    properties_count: 18,
    sales_count: 98,
    rating: 4.8,
    reviews_count: 67,
    is_active: true,
    created_at: '2019-06-20T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    slug: 'ana-martinez',
    first_name: 'Ana',
    last_name: 'Martinez',
    full_name: 'Ana Martinez',
    email: 'ana.martinez@redbot-realestate.com',
    phone: '+57 315 456 7890',
    whatsapp: '+57 315 456 7890',
    title: 'Consultora de Propiedades Residenciales',
    bio: 'Ana se especializa en ayudar a familias a encontrar el hogar perfecto. Su calidez y atencion al detalle hacen que el proceso de compra sea una experiencia memorable.',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    city: 'Cartagena',
    social_links: {
      instagram: 'https://instagram.com/ana_hogares',
      facebook: 'https://facebook.com/anamartinezrealestate',
    },
    properties_count: 15,
    sales_count: 72,
    rating: 5.0,
    reviews_count: 45,
    is_active: true,
    created_at: '2021-03-10T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: '4',
    slug: 'david-lopez',
    first_name: 'David',
    last_name: 'Lopez',
    full_name: 'David Lopez',
    email: 'david.lopez@redbot-realestate.com',
    phone: '+57 320 111 2233',
    title: 'Agente de Propiedades de Playa',
    bio: 'David conoce cada rincon de la costa colombiana. Especializado en propiedades frente al mar y desarrollos turisticos.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    city: 'Santa Marta',
    social_links: {
      instagram: 'https://instagram.com/david_playarealestate',
    },
    properties_count: 12,
    sales_count: 45,
    rating: 4.7,
    reviews_count: 32,
    is_active: true,
    created_at: '2022-01-05T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
  },
];

// ==========================================
// MOCK PROPERTIES
// ==========================================
// Mock data uses legacy format - cast as any[] to avoid type errors
// Real data comes from Supabase with correct types
export const MOCK_PROPERTIES: any[] = [
  {
    id: '1',
    slug: 'apartamento-moderno-chapinero',
    title: 'Apartamento Moderno en Chapinero Alto',
    description_short: 'Hermoso apartamento con vista a la ciudad y acabados de lujo.',
    description_full: `Este espectacular apartamento de 120m² en el corazon de Chapinero Alto ofrece una combinacion perfecta de modernidad y comodidad.

Con 3 amplias habitaciones, 2 banos completos y una terraza con vista panoramica a los cerros orientales, esta propiedad es ideal para familias o profesionales que buscan calidad de vida en una de las zonas mas exclusivas de Bogota.

La cocina tipo americano cuenta con electrodomesticos de alta gama y mesones en cuarzo. Los pisos en porcelanato de gran formato y la iluminacion LED empotrada crean un ambiente sofisticado y acogedor.

El edificio cuenta con gimnasio, salon social, parqueadero cubierto y seguridad 24 horas.`,
    city: 'Bogota',
    neighborhood: 'Chapinero Alto',
    address: 'Calle 70 #11-30',
    latitude: 4.6486,
    longitude: -74.0628,
    price: 850000000,
    currency: 'COP',
    property_type: 'Apartamento',
    status: 'Venta',
    bedrooms: 3,
    bathrooms: 2,
    area_m2: 120,
    parking_spots: 2,
    year_built: 2021,
    floors: 1,
    images: [
      { id: '1-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', alt: 'Sala principal', order: 1 },
      { id: '1-2', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', alt: 'Vista exterior', order: 2 },
      { id: '1-3', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', alt: 'Cocina', order: 3 },
      { id: '1-4', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', alt: 'Habitacion principal', order: 4 },
      { id: '1-5', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', alt: 'Bano', order: 5 },
    ],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    amenities: ['Gimnasio', 'Piscina', 'Seguridad 24/7', 'Ascensor', 'Terraza', 'Aire Acondicionado'],
    agent_id: '1',
    is_featured: true,
    is_active: true,
    views_count: 234,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'casa-campestre-chia',
    title: 'Casa Campestre con Jardin en Chia',
    description_short: 'Espectacular casa con amplios espacios verdes y vista a las montanas.',
    description_full: `Descubre esta increible casa campestre de 280m² construidos en un lote de 500m² ubicada en uno de los conjuntos mas exclusivos de Chia.

La propiedad cuenta con 4 habitaciones, cada una con bano privado, sala de estar con chimenea, comedor independiente, cocina integral con isla central y cuarto de servicio con bano.

El amplio jardin con zonas verdes es perfecto para familias con ninos o mascotas. Incluye BBQ cubierto, garaje para 3 vehiculos y bodega.

El conjunto ofrece vigilancia 24 horas, canchas de tenis y zona de juegos infantiles.`,
    city: 'Chia',
    neighborhood: 'Sindamanoy',
    latitude: 4.8637,
    longitude: -74.0351,
    price: 1500000000,
    currency: 'COP',
    property_type: 'Casa',
    status: 'Venta',
    bedrooms: 4,
    bathrooms: 4,
    area_m2: 280,
    lot_area_m2: 500,
    parking_spots: 3,
    garage_capacity: 3,
    year_built: 2019,
    floors: 2,
    images: [
      { id: '2-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', order: 1 },
      { id: '2-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', order: 2 },
      { id: '2-3', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', order: 3 },
    ],
    amenities: ['Jardin', 'BBQ', 'Garaje', 'Chimenea', 'Seguridad 24/7', 'Cancha de Tenis'],
    agent_id: '2',
    is_featured: true,
    is_active: true,
    views_count: 189,
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
  },
  {
    id: '3',
    slug: 'penthouse-poblado',
    title: 'Penthouse de Lujo en El Poblado',
    description_short: 'Exclusivo penthouse con terraza privada y vista panoramica de la ciudad.',
    description_full: `Vive el lujo en su maxima expresion en este espectacular penthouse de 350m² en el exclusivo sector de El Poblado, Medellin.

Con 4 habitaciones, 4 banos y medio, este penthouse ofrece vistas de 360 grados a la ciudad. La terraza privada de 80m² incluye jacuzzi, zona de BBQ y lounge.

Acabados de primera calidad: pisos en marmol italiano, cocina Italiana con electrodomesticos Miele, domótica completa y sistema de sonido Bose integrado.

2 parqueaderos privados + deposito. Edificio con piscina climatizada, spa, gimnasio premium y salon de eventos.`,
    city: 'Medellin',
    neighborhood: 'El Poblado',
    latitude: 6.2088,
    longitude: -75.5660,
    price: 2800000000,
    currency: 'COP',
    property_type: 'Penthouse',
    status: 'Venta',
    bedrooms: 4,
    bathrooms: 4,
    area_m2: 350,
    parking_spots: 2,
    year_built: 2023,
    floors: 2,
    images: [
      { id: '3-1', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', order: 1 },
      { id: '3-2', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', order: 2 },
      { id: '3-3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', order: 3 },
      { id: '3-4', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', order: 4 },
    ],
    amenities: ['Terraza', 'Jacuzzi', 'Vista Panoramica', 'Gimnasio', 'Piscina', 'Seguridad 24/7', 'Ascensor'],
    agent_id: '1',
    is_featured: true,
    is_active: true,
    views_count: 312,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: '4',
    slug: 'apartamento-bocagrande',
    title: 'Apartamento Frente al Mar en Bocagrande',
    description_short: 'Increible apartamento con vista directa al mar Caribe.',
    description_full: `Despierta cada manana con la brisa del mar en este hermoso apartamento de 95m² ubicado en primera linea de playa en Bocagrande, Cartagena.

2 habitaciones con aire acondicionado, 2 banos completos, sala-comedor con balcon y vista al mar. Cocina integral equipada.

Ideal para vacaciones o renta corta. El edificio cuenta con piscina, acceso directo a la playa, gimnasio y porteria 24 horas.

A pocos minutos del centro historico, restaurantes y centros comerciales.`,
    city: 'Cartagena',
    neighborhood: 'Bocagrande',
    latitude: 10.3997,
    longitude: -75.5547,
    price: 15000000,
    price_frequency: 'mes',
    currency: 'COP',
    property_type: 'Apartamento',
    status: 'Renta',
    bedrooms: 2,
    bathrooms: 2,
    area_m2: 95,
    parking_spots: 1,
    year_built: 2018,
    images: [
      { id: '4-1', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', order: 1 },
      { id: '4-2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', order: 2 },
    ],
    amenities: ['Piscina', 'Playa', 'Gimnasio', 'Aire Acondicionado', 'Balcon', 'Seguridad 24/7'],
    agent_id: '3',
    is_featured: true,
    is_active: true,
    views_count: 456,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-11T00:00:00Z',
  },
  {
    id: '5',
    slug: 'villa-santa-marta',
    title: 'Villa de Lujo con Piscina Privada',
    description_short: 'Espectacular villa con vistas al mar y todas las comodidades.',
    description_full: `Villa exclusiva de 400m² en lote de 1200m² ubicada en las colinas de Santa Marta con vistas impresionantes al mar Caribe.

5 habitaciones en suite, sala principal con techos dobles, comedor para 12 personas, cocina gourmet con isla, cuarto de servicio independiente.

Piscina infinita privada, jardin tropical, gazebo con BBQ, garaje para 4 vehiculos. Casa inteligente con sistema de seguridad y camaras.`,
    city: 'Santa Marta',
    neighborhood: 'Pozos Colorados',
    latitude: 11.2274,
    longitude: -74.1842,
    price: 3500000000,
    currency: 'COP',
    property_type: 'Villa',
    status: 'Venta',
    bedrooms: 5,
    bathrooms: 5,
    area_m2: 400,
    lot_area_m2: 1200,
    parking_spots: 4,
    year_built: 2022,
    images: [
      { id: '5-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', order: 1 },
      { id: '5-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', order: 2 },
      { id: '5-3', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', order: 3 },
    ],
    amenities: ['Piscina', 'Vista Panoramica', 'Jardin', 'BBQ', 'Seguridad 24/7', 'Garaje'],
    agent_id: '4',
    is_featured: true,
    is_active: true,
    views_count: 278,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '6',
    slug: 'oficina-centro-empresarial',
    title: 'Oficina en Centro Empresarial Premium',
    description_short: 'Oficina moderna en el mejor centro empresarial de Bogota.',
    description_full: `Oficina de 150m² en el prestigioso Centro Empresarial Santa Barbara, zona empresarial por excelencia de Bogota.

Espacio diafano con posibilidad de distribucion flexible. Cuenta con recepcion, 4 oficinas privadas, sala de juntas con capacidad para 10 personas, cocineta y 2 banos.

El edificio ofrece lobby de doble altura, ascensores de alta velocidad, parqueaderos de visitantes, cafeteria, y esta certificado LEED.

Excelente conectividad vial y cercano a estacion de TransMilenio.`,
    city: 'Bogota',
    neighborhood: 'Santa Barbara',
    latitude: 4.6965,
    longitude: -74.0329,
    price: 8500000,
    price_frequency: 'mes',
    currency: 'COP',
    property_type: 'Oficina',
    status: 'Renta',
    bedrooms: 0,
    bathrooms: 2,
    area_m2: 150,
    parking_spots: 3,
    year_built: 2020,
    images: [
      { id: '6-1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', order: 1 },
      { id: '6-2', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200', order: 2 },
    ],
    amenities: ['Ascensor', 'Seguridad 24/7', 'Aire Acondicionado', 'Internet / Wi-Fi'],
    agent_id: '2',
    is_featured: false,
    is_active: true,
    views_count: 145,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-09T00:00:00Z',
  },
  {
    id: '7',
    slug: 'apartamento-laureles',
    title: 'Apartamento Acogedor en Laureles',
    description_short: 'Apartamento perfecto para vivir en el mejor barrio de Medellin.',
    description_full: `Hermoso apartamento de 85m² en el tradicional barrio Laureles de Medellin. Zona tranquila, arborizada y con excelente vida de barrio.

3 habitaciones, 2 banos, sala-comedor con balcon, cocina semi-integral. Piso 5 con ascensor.

Cerca de La 70, restaurantes, bares, supermercados y estacion del Metro. Ideal para profesionales o parejas jovenes.`,
    city: 'Medellin',
    neighborhood: 'Laureles',
    latitude: 6.2469,
    longitude: -75.5913,
    price: 420000000,
    currency: 'COP',
    property_type: 'Apartamento',
    status: 'Venta',
    bedrooms: 3,
    bathrooms: 2,
    area_m2: 85,
    parking_spots: 1,
    year_built: 2015,
    images: [
      { id: '7-1', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', order: 1 },
      { id: '7-2', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', order: 2 },
    ],
    amenities: ['Ascensor', 'Balcon', 'Seguridad 24/7'],
    agent_id: '2',
    is_featured: false,
    is_active: true,
    views_count: 198,
    created_at: '2023-12-28T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
  },
  {
    id: '8',
    slug: 'casa-usaquen',
    title: 'Casa Colonial Restaurada en Usaquen',
    description_short: 'Hermosa casa colonial con encanto historico y comodidades modernas.',
    description_full: `Unica oportunidad de adquirir una casa colonial de 1920 completamente restaurada en el corazon de Usaquen.

220m² construidos en 2 plantas. 4 habitaciones, 3 banos, patio interior con fuente, sala con chimenea original, comedor con techos en madera.

Combina el encanto de la arquitectura colonial con acabados contemporaneos y todas las comodidades modernas. Zona historica, restaurantes y galerias a pasos.`,
    city: 'Bogota',
    neighborhood: 'Usaquen',
    latitude: 4.6952,
    longitude: -74.0312,
    price: 1850000000,
    currency: 'COP',
    property_type: 'Casa',
    status: 'Venta',
    bedrooms: 4,
    bathrooms: 3,
    area_m2: 220,
    year_built: 1920,
    images: [
      { id: '8-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', order: 1 },
      { id: '8-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', order: 2 },
    ],
    amenities: ['Chimenea', 'Jardin', 'Pisos de Madera', 'Techos Altos'],
    agent_id: '1',
    is_featured: false,
    is_active: true,
    views_count: 267,
    created_at: '2023-12-25T00:00:00Z',
    updated_at: '2024-01-07T00:00:00Z',
  },
  {
    id: '9',
    slug: 'local-comercial-zona-rosa',
    title: 'Local Comercial en Zona Rosa',
    description_short: 'Excelente local en la mejor zona comercial de Bogota.',
    description_full: `Local comercial de 180m² ubicado en la Zona Rosa de Bogota, la zona de mayor afluencia comercial y turistica de la ciudad.

Espacio en esquina con doble vitrina, ideal para restaurante, boutique o showroom. Cuenta con mezanine de 50m² adicionales, bano privado y cocina basica.

Zona con alto flujo peatonal las 24 horas. Cerca del Parque de la 93 y centros comerciales.`,
    city: 'Bogota',
    neighborhood: 'Zona Rosa',
    latitude: 4.6670,
    longitude: -74.0523,
    price: 25000000,
    price_frequency: 'mes',
    currency: 'COP',
    property_type: 'Local Comercial',
    status: 'Renta',
    bedrooms: 0,
    bathrooms: 1,
    area_m2: 180,
    year_built: 2010,
    images: [
      { id: '9-1', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', order: 1 },
    ],
    amenities: ['Seguridad 24/7', 'Aire Acondicionado'],
    agent_id: '2',
    is_featured: false,
    is_active: true,
    views_count: 134,
    created_at: '2023-12-20T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '10',
    slug: 'duplex-envigado',
    title: 'Duplex Moderno en Envigado',
    description_short: 'Duplex de diseno contemporaneo con excelentes acabados.',
    description_full: `Moderno duplex de 160m² en conjunto cerrado de Envigado. Arquitectura contemporanea con amplios espacios y luz natural.

Primer nivel: sala de doble altura, comedor, cocina abierta tipo isla, bano social, estudio. Segundo nivel: habitacion principal con walking closet y bano completo, 2 habitaciones adicionales con bano compartido.

Terraza privada de 25m², 2 parqueaderos cubiertos. Conjunto con piscina, gimnasio y salon social.`,
    city: 'Envigado',
    neighborhood: 'Zuñiga',
    latitude: 6.1739,
    longitude: -75.5866,
    price: 680000000,
    currency: 'COP',
    property_type: 'Duplex',
    status: 'Venta',
    bedrooms: 3,
    bathrooms: 3,
    area_m2: 160,
    parking_spots: 2,
    year_built: 2022,
    floors: 2,
    images: [
      { id: '10-1', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', order: 1 },
      { id: '10-2', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', order: 2 },
    ],
    amenities: ['Piscina', 'Gimnasio', 'Terraza', 'Walking Closet', 'Seguridad 24/7'],
    agent_id: '2',
    is_featured: false,
    is_active: true,
    views_count: 223,
    created_at: '2023-12-18T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getPropertyBySlug(slug: string): Property | undefined {
  return MOCK_PROPERTIES.find((p) => p.slug === slug);
}

export function getAgentById(id: string): Agent | undefined {
  return MOCK_AGENTS.find((a) => a.id === id);
}

export function getAgentBySlug(slug: string): Agent | undefined {
  return MOCK_AGENTS.find((a) => a.slug === slug);
}

export function getFeaturedProperties(limit: number = 6): Property[] {
  return MOCK_PROPERTIES.filter((p) => p.is_featured).slice(0, limit);
}

export function getPropertiesByAgent(agentId: string): Property[] {
  return MOCK_PROPERTIES.filter((p) => p.agent_id === agentId);
}

export function getAgentsMap(): Record<string, Agent> {
  return MOCK_AGENTS.reduce((acc, agent) => {
    acc[agent.id] = agent;
    return acc;
  }, {} as Record<string, Agent>);
}

// ==========================================
// MOCK PROJECTS (Desarrollos Inmobiliarios)
// ==========================================
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'torres-del-parque-chapinero',
    title: 'Torres del Parque Chapinero',
    description_short: 'Exclusivo proyecto residencial con vista a los cerros orientales y acabados de lujo.',
    description_full: `Torres del Parque Chapinero es el nuevo proyecto insignia de Constructora Élite, ubicado en el corazón de Chapinero Alto.

Este desarrollo de 2 torres de 25 pisos cada una ofrece apartamentos desde 65m² hasta 180m², diseñados con los más altos estándares de calidad y acabados premium.

**Características del proyecto:**
- Lobby con doble altura y diseño contemporáneo
- Gimnasio completamente equipado
- Piscina climatizada
- Terraza BBQ en el último piso con vista 360°
- Salón de coworking
- Zona de niños
- Parqueaderos con cargadores para vehículos eléctricos

Ubicación privilegiada a pocos pasos del Parque de la 93, centros comerciales, restaurantes y excelente acceso a transporte público.`,
    developer_name: 'Constructora Élite',
    developer_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    city: 'Bogota',
    neighborhood: 'Chapinero Alto',
    address: 'Carrera 7 #70-40',
    latitude: 4.6486,
    longitude: -74.0628,
    project_type: 'Residencial',
    status: 'En Construccion',
    total_units: 180,
    available_units: 45,
    floors: 25,
    completion_date: '2025-12-01',
    price_from: 450000000,
    price_to: 1200000000,
    currency: 'COP',
    units: [
      { type: 'Apartamento 1 Hab', area_min: 65, area_max: 75, price_from: 450000000, available: 12 },
      { type: 'Apartamento 2 Hab', area_min: 85, area_max: 110, price_from: 620000000, available: 18 },
      { type: 'Apartamento 3 Hab', area_min: 120, area_max: 150, price_from: 850000000, available: 10 },
      { type: 'Penthouse', area_min: 160, area_max: 180, price_from: 1100000000, available: 5 },
    ],
    amenities: ['Piscina', 'Gimnasio', 'BBQ', 'Salon Comunal', 'Coworking', 'Parqueadero Visitantes', 'Seguridad 24/7'],
    images: [
      { id: 'p1-1', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', alt: 'Fachada Torres del Parque', order: 1 },
      { id: 'p1-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', alt: 'Lobby', order: 2 },
      { id: 'p1-3', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', alt: 'Apartamento modelo', order: 3 },
      { id: 'p1-4', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', alt: 'Cocina', order: 4 },
      { id: 'p1-5', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200', alt: 'Amenidades', order: 5 },
    ],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    brochure_url: '/brochures/torres-del-parque.pdf',
    is_featured: true,
    is_active: true,
    views_count: 1250,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'mirador-de-santa-fe',
    title: 'Mirador de Santa Fe',
    description_short: 'Proyecto sobre planos en la zona más exclusiva de Santa Marta con vista al mar.',
    description_full: `Mirador de Santa Fe es un exclusivo proyecto frente al mar Caribe, desarrollado por Grupo Inmobiliario Costa.

Con 120 unidades distribuidas en 3 torres de 12 pisos, este proyecto ofrece apartamentos con espectaculares vistas al mar y a la Sierra Nevada de Santa Marta.

**Características únicas:**
- Acceso directo a playa privada
- Infinity pool con vista al mar
- Beach club exclusivo para residentes
- Spa y wellness center
- Restaurante gourmet
- Marina privada
- Helipuerto

Entrega estimada: Diciembre 2026. ¡Separe su unidad con solo el 10% de cuota inicial!`,
    developer_name: 'Grupo Inmobiliario Costa',
    city: 'Santa Marta',
    neighborhood: 'Pozos Colorados',
    latitude: 11.1986,
    longitude: -74.1897,
    project_type: 'Residencial',
    status: 'Preventa',
    total_units: 120,
    available_units: 95,
    floors: 12,
    completion_date: '2026-12-01',
    price_from: 850000000,
    price_to: 3500000000,
    currency: 'COP',
    units: [
      { type: 'Apartamento 2 Hab', area_min: 90, area_max: 110, price_from: 850000000, available: 35 },
      { type: 'Apartamento 3 Hab', area_min: 130, area_max: 160, price_from: 1200000000, available: 40 },
      { type: 'Penthouse', area_min: 200, area_max: 280, price_from: 2500000000, available: 20 },
    ],
    amenities: ['Piscina', 'Playa', 'Gimnasio', 'Spa', 'Restaurante', 'Seguridad 24/7', 'Jacuzzi'],
    images: [
      { id: 'p2-1', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', alt: 'Vista al mar', order: 1 },
      { id: 'p2-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', alt: 'Fachada', order: 2 },
      { id: 'p2-3', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', alt: 'Interior', order: 3 },
    ],
    is_featured: true,
    is_active: true,
    views_count: 890,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: '3',
    slug: 'centro-empresarial-poblado',
    title: 'Centro Empresarial El Poblado',
    description_short: 'Moderno edificio de oficinas AAA en la zona financiera de Medellín.',
    description_full: `Centro Empresarial El Poblado es el nuevo referente de oficinas premium en Medellín, desarrollado por Inversiones Antioquia S.A.

Edificio de 18 pisos con certificación LEED Gold, diseñado para empresas que buscan espacios modernos, eficientes y sostenibles.

**Características del edificio:**
- Certificación LEED Gold
- Sistemas de ahorro energético
- Fibra óptica de alta velocidad
- 4 ascensores inteligentes
- Parqueaderos con estaciones de carga eléctrica
- Helipuerto
- Auditorio para 150 personas
- Food court con terraza

Ubicación estratégica en la Milla de Oro de Medellín, cerca del metro y principales vías.`,
    developer_name: 'Inversiones Antioquia S.A.',
    city: 'Medellin',
    neighborhood: 'El Poblado',
    address: 'Carrera 43A #1-50',
    latitude: 6.2087,
    longitude: -75.5697,
    project_type: 'Comercial',
    status: 'En Construccion',
    total_units: 85,
    available_units: 32,
    floors: 18,
    completion_date: '2025-06-01',
    price_from: 180000000,
    price_to: 1500000000,
    currency: 'COP',
    units: [
      { type: 'Oficina 50m²', area_min: 45, area_max: 55, price_from: 180000000, available: 8 },
      { type: 'Oficina 100m²', area_min: 90, area_max: 110, price_from: 350000000, available: 12 },
      { type: 'Oficina 200m²', area_min: 180, area_max: 220, price_from: 680000000, available: 8 },
      { type: 'Piso Completo', area_min: 400, area_max: 450, price_from: 1300000000, available: 4 },
    ],
    amenities: ['Ascensor', 'Seguridad 24/7', 'Aire Acondicionado', 'Parqueadero Visitantes'],
    images: [
      { id: 'p3-1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200', alt: 'Edificio', order: 1 },
      { id: 'p3-2', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', alt: 'Oficina modelo', order: 2 },
      { id: 'p3-3', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200', alt: 'Sala de juntas', order: 3 },
    ],
    is_featured: true,
    is_active: true,
    views_count: 567,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    slug: 'jardines-de-envigado',
    title: 'Jardines de Envigado',
    description_short: 'Casas campestres con amplias zonas verdes en exclusivo condominio.',
    description_full: `Jardines de Envigado es un exclusivo condominio de 45 casas campestres desarrollado por Construhogar.

Cada casa cuenta con 350m² de construcción en lotes desde 500m², con diseño arquitectónico que maximiza la luz natural y la integración con la naturaleza.

**Características de las casas:**
- 4 habitaciones, cada una con baño privado
- Sala y comedor de doble altura
- Cocina integral con isla
- Estudio/oficina en casa
- Cuarto de servicio
- Jardín privado
- Garaje cubierto para 3 vehículos

**Zonas comunes:**
- Club house con piscina
- Canchas de tenis
- Senderos ecológicos
- Zona de juegos infantiles
- Salón de eventos`,
    developer_name: 'Construhogar',
    city: 'Envigado',
    neighborhood: 'Las Palmas',
    latitude: 6.1739,
    longitude: -75.5766,
    project_type: 'Residencial',
    status: 'Entrega Inmediata',
    total_units: 45,
    available_units: 8,
    floors: 2,
    completion_date: '2024-01-01',
    price_from: 1800000000,
    price_to: 2500000000,
    currency: 'COP',
    units: [
      { type: 'Casa Tipo A (350m²)', area_min: 350, area_max: 350, price_from: 1800000000, available: 3 },
      { type: 'Casa Tipo B (400m²)', area_min: 400, area_max: 400, price_from: 2100000000, available: 3 },
      { type: 'Casa Esquinera (450m²)', area_min: 450, area_max: 450, price_from: 2400000000, available: 2 },
    ],
    amenities: ['Piscina', 'Cancha de Tenis', 'Gimnasio', 'Salon Comunal', 'Area de Juegos', 'Seguridad 24/7', 'Jardin'],
    images: [
      { id: 'p4-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', alt: 'Casa modelo', order: 1 },
      { id: 'p4-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', alt: 'Exterior', order: 2 },
      { id: 'p4-3', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', alt: 'Cocina', order: 3 },
    ],
    is_featured: false,
    is_active: true,
    views_count: 445,
    created_at: '2023-11-15T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
  },
  {
    id: '5',
    slug: 'plaza-93-mixed-use',
    title: 'Plaza 93 Mixed Use',
    description_short: 'Proyecto de uso mixto con apartamentos, oficinas y comercio en zona premium.',
    description_full: `Plaza 93 Mixed Use es un innovador proyecto de uso mixto ubicado frente al Parque de la 93, desarrollado por Grupo Constructor Capital.

**Torre Residencial (30 pisos):**
- Apartamentos de 1, 2 y 3 habitaciones
- Amenidades exclusivas: rooftop bar, gimnasio, coworking

**Torre de Oficinas (20 pisos):**
- Oficinas desde 60m² hasta pisos completos
- Certificación LEED Silver

**Zona Comercial (3 pisos):**
- Locales comerciales y restaurantes
- Supermercado ancla

El proyecto integra perfectamente vivienda, trabajo y entretenimiento en una de las zonas más exclusivas de Bogotá.`,
    developer_name: 'Grupo Constructor Capital',
    city: 'Bogota',
    neighborhood: 'Chicó Norte',
    address: 'Carrera 13 #93-40',
    latitude: 4.6773,
    longitude: -74.0470,
    project_type: 'Mixto',
    status: 'Preventa',
    total_units: 250,
    available_units: 180,
    floors: 30,
    completion_date: '2027-06-01',
    price_from: 380000000,
    price_to: 2800000000,
    currency: 'COP',
    units: [
      { type: 'Apartamento 1 Hab', area_min: 55, area_max: 65, price_from: 380000000, available: 40 },
      { type: 'Apartamento 2 Hab', area_min: 80, area_max: 100, price_from: 580000000, available: 50 },
      { type: 'Oficina', area_min: 60, area_max: 200, price_from: 250000000, available: 60 },
      { type: 'Local Comercial', area_min: 40, area_max: 150, price_from: 350000000, available: 30 },
    ],
    amenities: ['Piscina', 'Gimnasio', 'Salon Comunal', 'Coworking', 'Restaurante', 'Seguridad 24/7', 'Terraza'],
    images: [
      { id: 'p5-1', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200', alt: 'Render exterior', order: 1 },
      { id: 'p5-2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', alt: 'Apartamento', order: 2 },
      { id: 'p5-3', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', alt: 'Oficina', order: 3 },
    ],
    is_featured: true,
    is_active: true,
    views_count: 1023,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
  },
];

// Project Helper Functions
export function getProjectBySlug(slug: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit: number = 4): Project[] {
  return MOCK_PROJECTS.filter((p) => p.is_featured && p.is_active).slice(0, limit);
}

export function getActiveProjects(): Project[] {
  return MOCK_PROJECTS.filter((p) => p.is_active);
}

// ==========================================
// MOCK TESTIMONIALS
// ==========================================
export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Andrea Fernandez',
    role: 'Compradora',
    company: 'Empresaria',
    content: 'Excelente servicio! Maria me ayudo a encontrar el apartamento perfecto en Chapinero. Su conocimiento del mercado y su paciencia hicieron que todo el proceso fuera muy facil. Altamente recomendada.',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    rating: 5,
    order: 1,
  },
  {
    id: '2',
    name: 'Roberto Mendez',
    role: 'Inversionista',
    company: 'Grupo Mendez S.A.S',
    content: 'Como inversionista, valoro mucho la asesoria de Carlos. Ha identificado propiedades con excelente potencial de valorizacion. En 3 anos, mi portafolio ha crecido significativamente gracias a sus recomendaciones.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    order: 2,
  },
  {
    id: '3',
    name: 'Lucia Ramirez',
    role: 'Vendedora',
    company: 'Arquitecta',
    content: 'Vendi mi casa en tiempo record y a un precio excelente. El equipo de Redbot manejo todo profesionalmente, desde las fotos hasta el cierre. Super agradecida por su dedicacion.',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    rating: 5,
    order: 3,
  },
  {
    id: '4',
    name: 'Felipe Torres',
    role: 'Arrendatario',
    company: 'Ingeniero de Software',
    content: 'Encontre el apartamento ideal para arrendar cerca de mi trabajo. El proceso fue muy agil y transparente. Ana fue muy profesional y siempre estuvo disponible para resolver mis dudas.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    rating: 4,
    order: 4,
  },
  {
    id: '5',
    name: 'Carmen Jimenez',
    role: 'Compradora',
    company: 'Medica',
    content: 'Compre mi primera vivienda con Redbot y fue una experiencia increible. Me guiaron en cada paso, desde la busqueda hasta la firma de escrituras. El equipo es muy profesional y humano.',
    photo_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200',
    rating: 5,
    order: 5,
  },
];

// ==========================================
// MOCK BLOG POSTS
// ==========================================
export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'guia-comprar-primera-vivienda-colombia',
    title: 'Guia Completa para Comprar tu Primera Vivienda en Colombia',
    excerpt: 'Todo lo que necesitas saber antes de dar el gran paso: financiacion, documentos, subsidios y consejos de expertos para comprar tu primer hogar.',
    content: `
# Guia Completa para Comprar tu Primera Vivienda en Colombia

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

Con la asesoria correcta, comprar vivienda puede ser un proceso sencillo y seguro.
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    author_name: 'Maria Garcia',
    author_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    category: 'Guias',
    tags: ['compra', 'primera vivienda', 'financiacion', 'subsidios'],
    published_at: '2024-01-20T10:00:00Z',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    slug: 'tendencias-mercado-inmobiliario-2024',
    title: 'Tendencias del Mercado Inmobiliario en Colombia 2024',
    excerpt: 'Analisis de las principales tendencias que estan marcando el sector inmobiliario este ano: precios, zonas emergentes y oportunidades de inversion.',
    content: `
# Tendencias del Mercado Inmobiliario en Colombia 2024

El mercado inmobiliario colombiano continua evolucionando. Estas son las principales tendencias que observamos este ano.

## Zonas de Mayor Valorizacion

- **Bogota**: Chapinero, Usaquen y la expansion hacia el norte
- **Medellin**: El Poblado sigue fuerte, pero emergen zonas como Laureles
- **Costa Caribe**: Barranquilla y Santa Marta con crecimiento sostenido

## Tipos de Propiedad en Demanda

Los apartamentos compactos (45-70 m2) lideran las ventas, seguidos por propiedades con espacios de home office.

## Inversion Extranjera

El interes de compradores internacionales sigue en aumento, especialmente de Estados Unidos y Europa.
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    author_name: 'Carlos Rodriguez',
    author_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    category: 'Mercado',
    tags: ['tendencias', 'inversion', '2024', 'analisis'],
    published_at: '2024-01-15T09:00:00Z',
    created_at: '2024-01-13T00:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
  },
  {
    id: '3',
    slug: 'como-aumentar-valor-propiedad',
    title: 'Como Aumentar el Valor de tu Propiedad Antes de Vender',
    excerpt: 'Consejos practicos y renovaciones estrategicas que pueden incrementar significativamente el valor de tu inmueble en el mercado.',
    content: `
# Como Aumentar el Valor de tu Propiedad Antes de Vender

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

Preparar tu propiedad para las visitas puede acelerar la venta y mejorar el precio hasta un 10%.
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    author_name: 'Ana Martinez',
    author_photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    category: 'Consejos',
    tags: ['venta', 'renovacion', 'valorizacion', 'consejos'],
    published_at: '2024-01-10T14:00:00Z',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-10T14:00:00Z',
  },
  {
    id: '4',
    slug: 'invertir-finca-raiz-vs-otras-opciones',
    title: 'Invertir en Finca Raiz vs Otras Opciones de Inversion',
    excerpt: 'Comparativa detallada entre inversion inmobiliaria y otras alternativas como acciones, CDTs y fondos de inversion.',
    content: `
# Invertir en Finca Raiz vs Otras Opciones de Inversion

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

La finca raiz requiere mayor capital inicial pero ofrece estabilidad y multiples formas de rentabilizar.
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800',
    author_name: 'Carlos Rodriguez',
    author_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    category: 'Inversion',
    tags: ['inversion', 'finanzas', 'comparativa', 'rentabilidad'],
    published_at: '2024-01-05T11:00:00Z',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-05T11:00:00Z',
  },
];

// Blog Helper Functions
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return MOCK_BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
  return [...MOCK_BLOG_POSTS]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit);
}
