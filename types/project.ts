export type ProjectStatus = 'En Construccion' | 'Preventa' | 'Entrega Inmediata' | 'Vendido';

export type ProjectType = 'Residencial' | 'Comercial' | 'Mixto' | 'Industrial';

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  is_main?: boolean;
}

export interface ProjectUnit {
  type: string; // e.g., "Apartamento 2 Hab", "Local Comercial"
  area_min: number;
  area_max: number;
  price_from: number;
  available: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description_short: string;
  description_full: string;

  // Developer Info
  developer_name: string;
  developer_logo?: string;

  // Location
  city: string;
  neighborhood: string;
  address?: string;
  latitude?: number;
  longitude?: number;

  // Project Details
  project_type: ProjectType;
  status: ProjectStatus;
  total_units: number;
  available_units: number;
  floors?: number;
  completion_date?: string; // Fecha estimada de entrega

  // Pricing
  price_from: number;
  price_to: number;
  currency: 'COP' | 'USD';

  // Units breakdown
  units?: ProjectUnit[];

  // Features
  amenities: string[];

  // Media
  images: ProjectImage[];
  video_url?: string;
  brochure_url?: string;
  virtual_tour_url?: string;

  // Metadata
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
