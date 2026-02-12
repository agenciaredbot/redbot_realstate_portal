// =====================================================
// PROJECT DATABASE TYPES
// =====================================================

export type ProjectStatusDB = 'preventa' | 'en_construccion' | 'entrega_inmediata' | 'vendido';

export interface ProjectDB {
  id: string;
  slug: string;
  name: string;
  developer: string | null;
  description_short: string | null;
  description: string | null;

  // Status
  status: ProjectStatusDB;
  completion_date: string | null;
  delivery_date: string | null;

  // Location
  address: string | null;
  city: string;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;

  // Pricing
  price_from: number | null;
  price_to: number | null;
  price_currency: string;

  // Units
  total_units: number | null;
  available_units: number | null;
  unit_types: string[] | null;
  area_from: number | null;
  area_to: number | null;

  // Media
  images: string[];
  logo_url: string | null;
  video_url: string | null;
  brochure_url: string | null;

  // Features
  amenities: string[];

  // Display
  is_featured: boolean;
  is_active: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ProjectFilters {
  search?: string;
  city?: string;
  status?: ProjectStatusDB;
  is_featured?: boolean;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  featured: number;
  preventa: number;
  en_construccion: number;
  entrega_inmediata: number;
  vendido: number;
}

export interface ProjectFormData {
  name: string;
  slug?: string;
  developer: string;
  description_short: string;
  description: string;
  status: ProjectStatusDB;
  completion_date: string;
  city: string;
  neighborhood: string;
  address: string;
  latitude?: number;
  longitude?: number;
  price_from: number;
  price_to: number;
  price_currency: string;
  total_units: number;
  available_units: number;
  unit_types: string[];
  area_from: number;
  area_to: number;
  images: string[];
  logo_url: string;
  video_url: string;
  brochure_url: string;
  amenities: string[];
  is_featured: boolean;
  is_active: boolean;
}

// Status labels for UI
export const PROJECT_STATUS_LABELS: Record<ProjectStatusDB, string> = {
  preventa: 'Preventa',
  en_construccion: 'En Construcción',
  entrega_inmediata: 'Entrega Inmediata',
  vendido: 'Vendido',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatusDB, string> = {
  preventa: 'bg-blue-100 text-blue-800',
  en_construccion: 'bg-yellow-100 text-yellow-800',
  entrega_inmediata: 'bg-green-100 text-green-800',
  vendido: 'bg-gray-100 text-gray-800',
};

// Common amenities for projects
export const PROJECT_AMENITIES = [
  'piscina',
  'gimnasio',
  'bbq',
  'salon_comunal',
  'coworking',
  'parqueadero_visitantes',
  'seguridad_24_7',
  'ascensor',
  'terraza',
  'zona_verde',
  'parque_infantil',
  'cancha_tenis',
  'cancha_squash',
  'spa',
  'sauna',
  'jacuzzi',
  'turco',
  'playa',
  'restaurante',
  'bar',
  'aire_acondicionado',
  'porteria',
  'citofono',
  'circuito_cerrado',
];

export const AMENITY_LABELS: Record<string, string> = {
  piscina: 'Piscina',
  gimnasio: 'Gimnasio',
  bbq: 'Zona BBQ',
  salon_comunal: 'Salon Comunal',
  coworking: 'Coworking',
  parqueadero_visitantes: 'Parqueadero Visitantes',
  seguridad_24_7: 'Seguridad 24/7',
  ascensor: 'Ascensor',
  terraza: 'Terraza',
  zona_verde: 'Zona Verde',
  parque_infantil: 'Parque Infantil',
  zona_infantil: 'Zona Infantil',
  cancha_tenis: 'Cancha de Tenis',
  cancha_squash: 'Cancha de Squash',
  spa: 'Spa',
  sauna: 'Sauna',
  jacuzzi: 'Jacuzzi',
  turco: 'Turco',
  playa: 'Acceso a Playa',
  restaurante: 'Restaurante',
  bar: 'Bar',
  aire_acondicionado: 'Aire Acondicionado',
  porteria: 'Porteria',
  citofono: 'Citofono',
  circuito_cerrado: 'Circuito Cerrado',
  senderos: 'Senderos',
};

// List format for forms with value/label pairs
export const AMENITIES_LIST = [
  { value: 'piscina', label: 'Piscina' },
  { value: 'gimnasio', label: 'Gimnasio' },
  { value: 'bbq', label: 'Zona BBQ' },
  { value: 'salon_comunal', label: 'Salon Comunal' },
  { value: 'coworking', label: 'Coworking' },
  { value: 'parqueadero_visitantes', label: 'Parqueadero Visitantes' },
  { value: 'seguridad_24_7', label: 'Seguridad 24/7' },
  { value: 'ascensor', label: 'Ascensor' },
  { value: 'terraza', label: 'Terraza' },
  { value: 'zona_verde', label: 'Zona Verde' },
  { value: 'zona_infantil', label: 'Zona Infantil' },
  { value: 'cancha_tenis', label: 'Cancha de Tenis' },
  { value: 'cancha_squash', label: 'Cancha de Squash' },
  { value: 'spa', label: 'Spa' },
  { value: 'sauna', label: 'Sauna' },
  { value: 'jacuzzi', label: 'Jacuzzi' },
  { value: 'turco', label: 'Turco' },
  { value: 'playa', label: 'Acceso a Playa' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'bar', label: 'Bar' },
  { value: 'porteria', label: 'Porteria' },
  { value: 'citofono', label: 'Citofono' },
  { value: 'circuito_cerrado', label: 'Circuito Cerrado' },
  { value: 'senderos', label: 'Senderos' },
];
