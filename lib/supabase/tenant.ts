// =====================================================
// TENANT HELPERS - Multi-tenant SaaS
// =====================================================

import { createAdminClient } from '@/lib/supabase/server';
import { Tenant, DEFAULT_TENANT_ID } from '@/types/tenant';
import { headers } from 'next/headers';

/**
 * Extract tenant identifier from request
 * Priority: Custom domain > Subdomain > Default
 */
export async function getTenantFromRequest(): Promise<Tenant> {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Remove port for local development
  const hostname = host.split(':')[0];

  // Check if it's a custom domain or subdomain
  const tenant = await resolveTenantFromHost(hostname);

  if (!tenant) {
    throw new TenantNotFoundError(`No tenant found for host: ${hostname}`);
  }

  if (!tenant.is_active) {
    throw new TenantInactiveError(`Tenant ${tenant.slug} is inactive`);
  }

  return tenant;
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Tenant;
}

/**
 * Get tenant by ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Tenant;
}

/**
 * Get tenant by domain (custom domain or subdomain)
 */
export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  const supabase = createAdminClient();

  // First try custom domain
  let { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('domain', domain)
    .eq('is_active', true)
    .single();

  if (!error && data) {
    return data as Tenant;
  }

  // Then try subdomain (extract first part of hostname)
  const subdomain = domain.split('.')[0];

  ({ data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('is_active', true)
    .single());

  if (!error && data) {
    return data as Tenant;
  }

  return null;
}

/**
 * Resolve tenant from hostname
 * Handles: custom domains, subdomains, and localhost
 */
async function resolveTenantFromHost(hostname: string): Promise<Tenant | null> {
  const supabase = createAdminClient();

  // Development: localhost always returns default tenant
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return getDefaultTenant();
  }

  // Check for custom domain first
  const { data: customDomainTenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('domain', hostname)
    .eq('is_active', true)
    .single();

  if (customDomainTenant) {
    return customDomainTenant as Tenant;
  }

  // Check for subdomain (e.g., xyz.redbot.io)
  // Extract subdomain from hostname
  const parts = hostname.split('.');

  // If it's a subdomain of our main domain
  if (parts.length >= 3) {
    const subdomain = parts[0];

    // Skip common subdomains
    if (['www', 'app', 'api', 'admin'].includes(subdomain)) {
      return getDefaultTenant();
    }

    const { data: subdomainTenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .single();

    if (subdomainTenant) {
      return subdomainTenant as Tenant;
    }
  }

  // Check if it's our main domain
  const mainDomains = [
    'redbot.io',
    'redbot.com',
    'redbotrealestate.com',
    'vercel.app', // For preview deployments
  ];

  const isMainDomain = mainDomains.some(domain =>
    hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (isMainDomain) {
    return getDefaultTenant();
  }

  // Unknown domain - return null
  return null;
}

/**
 * Get the default tenant (Redbot)
 */
export async function getDefaultTenant(): Promise<Tenant> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', DEFAULT_TENANT_ID)
    .single();

  if (error || !data) {
    // Fallback tenant object if database doesn't have it yet
    return {
      id: DEFAULT_TENANT_ID,
      name: 'Redbot Real Estate',
      slug: 'redbot',
      domain: null,
      subdomain: 'app',
      logo_url: '/images/logo.png',
      logo_dark_url: '/images/logo-dark.png',
      favicon_url: '/favicon.ico',
      primary_color: '#C9A962',
      secondary_color: '#1A1A1A',
      accent_color: '#FFFFFF',
      company_name: 'Redbot Real Estate',
      company_email: 'info@redbotrealestate.com',
      company_phone: '+57 300 000 0000',
      company_address: 'Bogotá, Colombia',
      company_whatsapp: null,
      social_links: {},
      template: 'modern',
      plan: 'enterprise',
      plan_expires_at: null,
      max_properties: 999999,
      max_agents: 999999,
      max_storage_mb: 50000,
      features: {
        blog: true,
        projects: true,
        testimonials: true,
        analytics: true,
        custom_domain: true,
        white_label: true,
        api_access: true,
      },
      seo_title: 'Redbot Real Estate - Propiedades en Colombia',
      seo_description: 'Encuentra tu propiedad ideal en Colombia',
      seo_keywords: null,
      og_image_url: null,
      manifest_url: null,
      ghl_location_id: null,
      ghl_api_key: null,
      is_active: true,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return data as Tenant;
}

/**
 * Get tenant ID from current user's profile
 */
export async function getCurrentUserTenantId(): Promise<string | null> {
  const supabase = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  return profile?.tenant_id || null;
}

/**
 * Validate that a user belongs to a specific tenant
 */
export async function validateUserTenant(userId: string, tenantId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', userId)
    .single();

  return data?.tenant_id === tenantId;
}

/**
 * Get all tenants (for super-admin)
 */
export async function getAllTenants(): Promise<Tenant[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }

  return data as Tenant[];
}

/**
 * Create a new tenant
 */
export async function createTenant(tenant: Partial<Tenant>): Promise<Tenant> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .insert([tenant])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create tenant: ${error.message}`);
  }

  return data as Tenant;
}

/**
 * Update a tenant
 */
export async function updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tenant: ${error.message}`);
  }

  return data as Tenant;
}

// =====================================================
// CUSTOM ERRORS
// =====================================================

export class TenantNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantNotFoundError';
  }
}

export class TenantInactiveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantInactiveError';
  }
}

export class TenantAccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantAccessDeniedError';
  }
}
