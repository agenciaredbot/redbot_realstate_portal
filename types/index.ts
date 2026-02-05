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
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;

  // Inquiry
  inquiry_type: 'comprar' | 'vender' | 'arrendar' | 'inversion' | 'otro' | 'property_inquiry';

  // CRM Integration
  ghl_contact_id?: string;
  ghl_synced_at?: string;

  // Status tracking
  status: string;
  notes?: string;

  // Metadata
  source: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
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
  featured_image: string;
  author_name: string;
  author_avatar?: string;
  category: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  published_at: string;
  views_count: number;
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
