import type { NavItem, PropertyCategory, Amenity, PropertyType } from '@/types';

// Navigation Items
export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Inicio',
    href: '/',
  },
  {
    label: 'Propiedades',
    href: '/propiedades',
    children: [
      { label: 'Todas las Propiedades', href: '/propiedades' },
      { label: 'En Venta', href: '/propiedades?status=venta' },
      { label: 'En Arriendo', href: '/propiedades?status=arriendo' },
    ],
  },
  {
    label: 'Proyectos',
    href: '/proyectos',
  },
  {
    label: 'Agentes',
    href: '/agentes',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Links',
    href: '#',
    children: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
];

// Property Types (matching database enum values)
export const PROPERTY_TYPES: PropertyType[] = [
  'apartamento',
  'casa',
  'oficina',
  'local',
  'lote',
  'finca',
  'bodega',
  'consultorio',
];

// Property Types for display (legacy support)
export const PROPERTY_TYPES_DISPLAY: string[] = [
  'Apartamento',
  'Casa',
  'Oficina',
  'Local',
  'Lote',
  'Finca',
  'Bodega',
  'Consultorio',
];

// Property Type Labels (for display)
export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'apartamento': 'Apartamento',
  'casa': 'Casa',
  'oficina': 'Oficina',
  'local': 'Local Comercial',
  'lote': 'Lote',
  'finca': 'Finca',
  'bodega': 'Bodega',
  'consultorio': 'Consultorio',
};

// Transaction/Status Type Labels (matching database enum)
export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  'venta': 'En Venta',
  'arriendo': 'En Arriendo',
  'venta_arriendo': 'Venta y Arriendo',
};

// Amenities List
export const AMENITIES_LIST: Amenity[] = [
  'Aire Acondicionado',
  'Balcon',
  'Chimenea',
  'Amoblado',
  'Garaje',
  'Pisos de Madera',
  'Techos Altos',
  'Internet / Wi-Fi',
  'Cuarto de Lavado',
  'Sala de Medios',
  'Piscina',
  'Walking Closet',
  'Gimnasio',
  'Seguridad 24/7',
  'Ascensor',
  'Terraza',
  'Jardin',
  'BBQ',
  'Salon Comunal',
  'Parqueadero Visitantes',
];

// Default Property Categories with placeholder images
export const DEFAULT_CATEGORIES: PropertyCategory[] = [
  {
    type: 'Apartamento',
    label: 'Apartamentos',
    image_url: '/images/categories/apartment.jpg',
    count: 0,
  },
  {
    type: 'Casa',
    label: 'Casas',
    image_url: '/images/categories/house.jpg',
    count: 0,
  },
  {
    type: 'Villa',
    label: 'Villas',
    image_url: '/images/categories/villa.jpg',
    count: 0,
  },
  {
    type: 'Townhouse',
    label: 'Townhouses',
    image_url: '/images/categories/townhouse.jpg',
    count: 0,
  },
  {
    type: 'Penthouse',
    label: 'Penthouses',
    image_url: '/images/categories/penthouse.jpg',
    count: 0,
  },
  {
    type: 'Local Comercial',
    label: 'Locales Comerciales',
    image_url: '/images/categories/commercial.jpg',
    count: 0,
  },
];

// Colombian Cities
export const COLOMBIAN_CITIES = [
  'Bogota',
  'Medellin',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Santa Marta',
  'Pereira',
  'Manizales',
  'Ibague',
  'Cucuta',
  'Villavicencio',
  'Armenia',
  'Pasto',
  'Monteria',
];

// Price Ranges for Filters (in COP)
export const PRICE_RANGES = {
  sale: {
    min: 0,
    max: 5_000_000_000, // 5 billion COP
    step: 50_000_000, // 50 million
    default: [0, 2_500_000_000],
  },
  rent: {
    min: 0,
    max: 50_000_000, // 50 million COP/month
    step: 500_000, // 500k
    default: [0, 25_000_000],
  },
};

// Area Ranges for Filters (in m2)
export const AREA_RANGE = {
  min: 0,
  max: 10_000,
  step: 10,
  default: [0, 5_000],
};

// Bedroom/Bathroom options
export const ROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6+', label: '6+' },
];

// Site Metadata
export const SITE_CONFIG = {
  name: 'Redbot Real Estate',
  description: 'Portal inmobiliario con las mejores propiedades en Colombia. Encuentra casas, apartamentos, villas y mas.',
  url: 'https://redbot-realestate.com',
  ogImage: '/images/og-image.jpg',
  keywords: [
    'inmobiliaria',
    'propiedades',
    'casas en venta',
    'apartamentos',
    'bienes raices',
    'Colombia',
    'arriendo',
    'comprar casa',
  ],
};

// Social Links (placeholder)
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/redbotrealestate',
  instagram: 'https://instagram.com/redbotrealestate',
  linkedin: 'https://linkedin.com/company/redbotrealestate',
  twitter: 'https://twitter.com/redbotrealestate',
  youtube: 'https://youtube.com/@redbotrealestate',
};

// Contact Info (placeholder)
export const CONTACT_INFO = {
  phone: '+57 601 234 5678',
  whatsapp: '+57 300 123 4567',
  email: 'info@redbot-realestate.com',
  address: 'Calle 100 #19-61, Oficina 1001',
  city: 'Bogota, Colombia',
};
