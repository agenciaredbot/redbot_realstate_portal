// =====================================================
// TENANT TYPES - Multi-tenant SaaS
// =====================================================

/**
 * Tenant - Represents a real estate company using the platform
 * Each tenant has its own branding, domain, and data isolation
 */
export interface Tenant {
  id: string;

  // Basic info
  name: string;
  slug: string;

  // Domain configuration
  domain: string | null;      // Custom domain (e.g., inmobiliariaxyz.com)
  subdomain: string | null;   // Subdomain (e.g., xyz.redbot.io)

  // Branding
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string;      // Default: #C9A962
  secondary_color: string;    // Default: #1A1A1A
  accent_color: string;       // Default: #FFFFFF

  // Contact info
  company_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  company_whatsapp: string | null;

  // Social links
  social_links: TenantSocialLinks;

  // Design template
  template: TenantTemplate;

  // Plan and billing
  plan: TenantPlan;
  plan_expires_at: string | null;

  // Limits based on plan
  max_properties: number;
  max_agents: number;
  max_storage_mb: number;

  // Features
  features: TenantFeatures;

  // Hero section content
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;

  // About section content
  about_title: string | null;
  about_description: string | null;
  about_image_url: string | null;
  about_stats: TenantAboutStats | null;

  // Footer content
  footer_description: string | null;
  footer_copyright: string | null;

  // Additional branding
  accent_color_2: string | null;
  font_heading: string | null;
  font_body: string | null;

  // Contact page content
  contact_title: string | null;
  contact_description: string | null;
  contact_map_url: string | null;

  // SEO defaults
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  og_image_url: string | null;
  manifest_url: string | null;

  // CRM Integration
  ghl_location_id: string | null;
  ghl_api_key: string | null;

  // Status
  is_active: boolean;

  // Settings (flexible key-value)
  settings: Record<string, unknown>;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Social links structure for tenant
 */
export interface TenantSocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
}

/**
 * About section statistics
 */
export interface TenantAboutStats {
  properties?: string;
  clients?: string;
  years?: string;
  agents?: string;
}

/**
 * Available templates
 */
export type TenantTemplate = 'modern' | 'classic' | 'minimal';

export const TENANT_TEMPLATES: Record<TenantTemplate, string> = {
  modern: 'Moderno',
  classic: 'Clásico',
  minimal: 'Minimalista',
};

/**
 * Subscription plans
 */
export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export const TENANT_PLANS: Record<TenantPlan, TenantPlanDetails> = {
  free: {
    name: 'Gratuito',
    price: 0,
    maxProperties: 10,
    maxAgents: 1,
    maxStorageMb: 500,
    features: {
      blog: true,
      projects: false,
      testimonials: true,
      analytics: false,
      custom_domain: false,
      white_label: false,
      api_access: false,
    },
  },
  starter: {
    name: 'Starter',
    price: 49,
    maxProperties: 50,
    maxAgents: 3,
    maxStorageMb: 2000,
    features: {
      blog: true,
      projects: true,
      testimonials: true,
      analytics: true,
      custom_domain: false,
      white_label: false,
      api_access: false,
    },
  },
  professional: {
    name: 'Profesional',
    price: 99,
    maxProperties: 200,
    maxAgents: 10,
    maxStorageMb: 10000,
    features: {
      blog: true,
      projects: true,
      testimonials: true,
      analytics: true,
      custom_domain: true,
      white_label: false,
      api_access: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    maxProperties: 999999,
    maxAgents: 999999,
    maxStorageMb: 50000,
    features: {
      blog: true,
      projects: true,
      testimonials: true,
      analytics: true,
      custom_domain: true,
      white_label: true,
      api_access: true,
    },
  },
};

export interface TenantPlanDetails {
  name: string;
  price: number; // USD per month
  maxProperties: number;
  maxAgents: number;
  maxStorageMb: number;
  features: TenantFeatures;
}

/**
 * Feature flags for tenant
 */
export interface TenantFeatures {
  blog: boolean;
  projects: boolean;
  testimonials: boolean;
  analytics: boolean;
  custom_domain: boolean;
  white_label: boolean;
  api_access: boolean;
}

/**
 * Tenant context for React
 */
export interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Create tenant form
 */
export interface CreateTenantForm {
  name: string;
  slug: string;
  subdomain?: string;
  company_name: string;
  company_email: string;
  company_phone?: string;
  plan: TenantPlan;
}

/**
 * Update tenant form
 */
export interface UpdateTenantForm {
  name?: string;
  domain?: string;
  subdomain?: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_whatsapp?: string;
  social_links?: TenantSocialLinks;
  template?: TenantTemplate;
  plan?: TenantPlan;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  ghl_location_id?: string;
  ghl_api_key?: string;
  is_active?: boolean;
  settings?: Record<string, unknown>;
}

/**
 * Tenant stats for super-admin dashboard
 */
export interface TenantStats {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  is_active: boolean;
  properties_count: number;
  agents_count: number;
  users_count: number;
  leads_count: number;
  storage_used_mb: number;
  created_at: string;
  last_activity_at: string | null;
}

/**
 * Super-admin dashboard stats
 */
export interface SuperAdminDashboardStats {
  total_tenants: number;
  active_tenants: number;
  total_revenue_monthly: number;
  total_properties: number;
  total_agents: number;
  total_leads: number;
  tenants_by_plan: Record<TenantPlan, number>;
  new_tenants_this_month: number;
  churn_rate: number;
}

/**
 * Default tenant ID for the original Redbot installation
 */
export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

/**
 * CSS variable names for theming
 */
export const TENANT_CSS_VARIABLES = {
  primaryColor: '--color-primary',
  secondaryColor: '--color-secondary',
  accentColor: '--color-accent',
} as const;

/**
 * Apply tenant theme to document
 */
export function applyTenantTheme(tenant: Tenant): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty(TENANT_CSS_VARIABLES.primaryColor, tenant.primary_color);
  root.style.setProperty(TENANT_CSS_VARIABLES.secondaryColor, tenant.secondary_color);
  root.style.setProperty(TENANT_CSS_VARIABLES.accentColor, tenant.accent_color);

  // Update favicon if provided
  if (tenant.favicon_url) {
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = tenant.favicon_url;
    }
  }
}

/**
 * Get tenant display URL
 */
export function getTenantUrl(tenant: Tenant): string {
  if (tenant.domain) {
    return `https://${tenant.domain}`;
  }
  if (tenant.subdomain) {
    return `https://${tenant.subdomain}.redbot.io`;
  }
  return `https://redbot.io/t/${tenant.slug}`;
}

/**
 * Check if tenant feature is enabled
 */
export function hasFeature(tenant: Tenant, feature: keyof TenantFeatures): boolean {
  return tenant.features[feature] === true;
}

/**
 * Check if tenant has reached property limit
 */
export function hasReachedPropertyLimit(tenant: Tenant, currentCount: number): boolean {
  return currentCount >= tenant.max_properties;
}

/**
 * Check if tenant has reached agent limit
 */
export function hasReachedAgentLimit(tenant: Tenant, currentCount: number): boolean {
  return currentCount >= tenant.max_agents;
}
