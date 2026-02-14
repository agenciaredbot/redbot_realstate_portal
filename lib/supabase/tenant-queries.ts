// =====================================================
// TENANT-AWARE QUERY HELPERS
// Wrappers for multi-tenant data access
// =====================================================

import { headers } from 'next/headers';
import { createAdminClient } from './server';
import { DEFAULT_TENANT_ID } from '@/types/tenant';

/**
 * Get the current tenant ID from request headers
 * Falls back to default tenant for local development
 */
export async function getCurrentTenantId(): Promise<string> {
  try {
    const headersList = await headers();
    const tenantId = headersList.get('x-tenant-id');
    return tenantId || DEFAULT_TENANT_ID;
  } catch {
    // headers() might not be available in some contexts
    return DEFAULT_TENANT_ID;
  }
}

/**
 * Get the current tenant slug from request headers
 */
export async function getCurrentTenantSlug(): Promise<string> {
  try {
    const headersList = await headers();
    const tenantSlug = headersList.get('x-tenant-slug');
    return tenantSlug || 'redbot';
  } catch {
    return 'redbot';
  }
}

/**
 * Create a tenant-filtered query builder
 * Automatically adds tenant_id filter to all queries
 */
export function createTenantQuery(tenantId: string) {
  const supabase = createAdminClient();

  return {
    /**
     * Query properties for the tenant
     */
    properties: () =>
      supabase
        .from('properties')
        .select('*, agent:agents(id, slug, first_name, last_name, photo_url, phone, email)')
        .eq('tenant_id', tenantId),

    /**
     * Query agents for the tenant
     */
    agents: () =>
      supabase
        .from('agents')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query projects for the tenant
     */
    projects: () =>
      supabase
        .from('projects')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query blog posts for the tenant
     */
    blogPosts: () =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query blog categories for the tenant
     */
    blogCategories: () =>
      supabase
        .from('blog_categories')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query testimonials for the tenant
     */
    testimonials: () =>
      supabase
        .from('testimonials')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query contact submissions for the tenant
     */
    contactSubmissions: () =>
      supabase
        .from('contact_submissions')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query site settings for the tenant
     */
    siteSettings: () =>
      supabase
        .from('site_settings')
        .select('key, value')
        .eq('tenant_id', tenantId),

    /**
     * Query notifications for the tenant
     */
    notifications: () =>
      supabase
        .from('notifications')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Query profiles for the tenant
     */
    profiles: () =>
      supabase
        .from('profiles')
        .select('*')
        .eq('tenant_id', tenantId),

    /**
     * Raw Supabase client for custom queries
     */
    raw: supabase,

    /**
     * The tenant ID being used
     */
    tenantId,
  };
}

/**
 * Convenience function to get a tenant query builder for the current request
 */
export async function getTenantQuery() {
  const tenantId = await getCurrentTenantId();
  return createTenantQuery(tenantId);
}

/**
 * Insert data with automatic tenant_id
 */
export async function insertWithTenant<T extends Record<string, unknown>>(
  table: string,
  data: T | T[],
  tenantId: string
) {
  const supabase = createAdminClient();

  const dataWithTenant = Array.isArray(data)
    ? data.map((item) => ({ ...item, tenant_id: tenantId }))
    : { ...data, tenant_id: tenantId };

  return supabase.from(table).insert(dataWithTenant);
}

/**
 * Update data with tenant validation
 */
export async function updateWithTenant<T extends Record<string, unknown>>(
  table: string,
  id: string,
  data: T,
  tenantId: string
) {
  const supabase = createAdminClient();

  return supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .eq('tenant_id', tenantId);
}

/**
 * Delete data with tenant validation
 */
export async function deleteWithTenant(
  table: string,
  id: string,
  tenantId: string
) {
  const supabase = createAdminClient();

  return supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId);
}

/**
 * Validate that a record belongs to the tenant
 */
export async function validateTenantAccess(
  table: string,
  id: string,
  tenantId: string
): Promise<boolean> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single();

  return !error && !!data;
}
