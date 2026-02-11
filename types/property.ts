// Database enum values (lowercase)
export type PropertyStatus = 'venta' | 'arriendo' | 'venta_arriendo';

export type PropertyType =
  | 'apartamento'
  | 'casa'
  | 'oficina'
  | 'local'
  | 'lote'
  | 'finca'
  | 'bodega'
  | 'consultorio';

export type Amenity = string; // Amenities are stored as normalized strings in DB

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface Property {
  id: string;
  reference_code?: string; // Human-readable code (e.g., RB-0001)
  slug: string;
  title: string;
  description_short?: string;
  description?: string;

  // Location
  city: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;

  // Pricing
  price: number;
  price_currency?: string;
  admin_fee?: number;

  // Property Details
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area_m2?: number;
  area_built_m2?: number;
  parking_spots?: number;
  year_built?: number;
  stratum?: number;
  floor_number?: number;
  total_floors?: number;

  // Media
  images?: string[];
  video_url?: string;
  virtual_tour_url?: string;

  // Features
  amenities?: string[];

  // Relationships
  agent_id?: string;
  agent?: any; // Joined agent data

  // Metadata
  is_featured: boolean;
  is_active: boolean;
  airtable_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  status?: PropertyStatus;
  property_type?: PropertyType | PropertyType[];
  city?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  is_featured?: boolean;
  search?: string;
  reference_code?: string; // Search by reference code (e.g., RB-0001)
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
