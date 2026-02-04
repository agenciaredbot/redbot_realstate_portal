export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface Agent {
  id: string;
  slug: string;

  // Personal Info
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;

  // Professional Info
  title: string; // e.g., "Senior Real Estate Agent"
  bio: string;
  photo_url: string;
  license_number?: string;

  // Location
  city: string;
  office_address?: string;

  // Social Media
  social_links: SocialLinks;

  // Stats
  properties_count: number;
  sales_count?: number;
  rating?: number;
  reviews_count?: number;

  // Metadata
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentListResponse {
  agents: Agent[];
  total: number;
  page: number;
  limit: number;
}
