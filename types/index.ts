// Property Types
export * from './property';

// Agent Types
export * from './agent';

// Contact Form Types
export interface ContactSubmission {
  id: string;
  property_id?: string;
  agent_id?: string;

  // Contact Info
  full_name: string;
  email: string;
  phone?: string;
  message: string;

  // Source
  source_page: string;
  source_url?: string;

  // Metadata
  created_at: string;
  is_processed: boolean;
  ghl_contact_id?: string;
  ghl_opportunity_id?: string;
}

// Site Configuration Types
export interface SiteConfig {
  id: string;
  company_name: string;
  company_tagline: string;
  logo_url: string;
  logo_dark_url?: string;

  // Contact Info
  phone: string;
  email: string;
  address: string;
  city: string;

  // Social Media
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  tiktok_url?: string;

  // Statistics (for homepage counters)
  stats_properties: number;
  stats_agents: number;
  stats_clients: number;
  stats_countries: number;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Service Types (for homepage)
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  order: number;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  photo_url?: string;
  rating: number; // 1-5
  order: number;
}

// Blog Post Types (basic, will expand with CMS)
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_name: string;
  author_photo_url?: string;
  category: string;
  tags: string[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

// Project Types
export * from './project';

// Category Types (for homepage)
export interface PropertyCategory {
  type: string;
  label: string;
  image_url: string;
  count: number;
}
