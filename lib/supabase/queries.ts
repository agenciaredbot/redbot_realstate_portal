import { createServerSupabaseClient, createAdminClient } from './server';
import { getCurrentTenantId, insertWithTenant } from './tenant-queries';
import type { Property, Agent, PropertyFilters } from '@/types';

// =====================================================
// PROPERTIES QUERIES (Multi-tenant)
// =====================================================

export async function getProperties(filters?: PropertyFilters, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  let query = supabase
    .from('properties')
    .select(`
      *,
      agent:agents(id, slug, first_name, last_name, photo_url, phone, email)
    `)
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.property_type) {
    query = query.eq('property_type', filters.property_type);
  }

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.min_price) {
    query = query.gte('price', filters.min_price);
  }

  if (filters?.max_price) {
    query = query.lte('price', filters.max_price);
  }

  if (filters?.bedrooms) {
    query = query.gte('bedrooms', filters.bedrooms);
  }

  if (filters?.bathrooms) {
    query = query.gte('bathrooms', filters.bathrooms);
  }

  if (filters?.min_area) {
    query = query.gte('area_m2', filters.min_area);
  }

  if (filters?.max_area) {
    query = query.lte('area_m2', filters.max_area);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,city.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%`);
  }

  // Ordering
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data || [];
}

export async function getPropertyBySlug(slug: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(*)
    `)
    .eq('tenant_id', currentTenantId)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('submission_status', 'approved')
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
}

export async function getFeaturedProperties(limit = 6, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(id, slug, first_name, last_name, photo_url)
    `)
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return data || [];
}

export async function getRecentProperties(limit = 9, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(id, slug, first_name, last_name, photo_url)
    `)
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent properties:', error);
    return [];
  }

  return data || [];
}

// =====================================================
// AGENTS QUERIES (Multi-tenant)
// =====================================================

export async function getAgents(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

export async function getAgentBySlug(slug: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('tenant_id', currentTenantId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching agent:', error);
    return null;
  }

  return data;
}

export async function getAgentWithProperties(slug: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  // Get agent
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('tenant_id', currentTenantId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (agentError || !agent) {
    console.error('Error fetching agent:', agentError);
    return null;
  }

  // Get agent's properties
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .eq('tenant_id', currentTenantId)
    .eq('agent_id', agent.id)
    .eq('is_active', true)
    .eq('submission_status', 'approved')
    .order('created_at', { ascending: false });

  if (propertiesError) {
    console.error('Error fetching agent properties:', propertiesError);
  }

  return {
    ...agent,
    properties: properties || [],
  };
}

// =====================================================
// TESTIMONIALS, BLOG, PROJECTS → Moved to Sanity CMS
// See: lib/sanity/queries.ts
// =====================================================

// =====================================================
// CONTACT SUBMISSIONS (Multi-tenant)
// =====================================================

export async function createContactSubmission(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType?: string;
  message: string;
  propertyId?: string;
  agentId?: string;
  source?: string;
}, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
      tenant_id: currentTenantId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      inquiry_type: data.inquiryType || 'otro',
      message: data.message,
      property_id: data.propertyId || null,
      agent_id: data.agentId || null,
      source: data.source || 'website',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contact submission:', error);
    throw error;
  }

  return submission;
}

// =====================================================
// SITE SETTINGS (Multi-tenant)
// =====================================================

export async function getSiteSetting(key: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('tenant_id', currentTenantId)
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }

  return data?.value;
}

export async function getAllSiteSettings(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('tenant_id', currentTenantId);

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  // Convert array to object
  return (data || []).reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, unknown>);
}

// =====================================================
// STATIC GENERATION QUERIES (for generateStaticParams)
// These use admin client and return data for ALL tenants
// Static generation happens at build time for all slugs
// =====================================================

export async function getAllPropertySlugs() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select('slug, tenant_id')
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  if (error) {
    console.error('Error fetching property slugs:', error);
    return [];
  }

  return data || [];
}

export async function getAllAgentSlugs() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('agents')
    .select('slug, tenant_id')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching agent slugs:', error);
    return [];
  }

  return data || [];
}

// Blog/Project slugs → Moved to Sanity CMS (lib/sanity/queries.ts)

// =====================================================
// UTILITY FUNCTIONS (Multi-tenant)
// =====================================================

export async function getCities(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select('city')
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Get unique cities
  const cities = [...new Set(data?.map((p) => p.city) || [])];
  return cities.sort();
}

export async function getPropertyTypes(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select('property_type')
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  if (error) {
    console.error('Error fetching property types:', error);
    return [];
  }

  // Get unique types
  const types = [...new Set(data?.map((p) => p.property_type) || [])];
  return types;
}

export async function getPropertiesCount(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  if (error) {
    console.error('Error fetching properties count:', error);
    return 0;
  }

  return count || 0;
}

export async function getAgentsCount(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching agents count:', error);
    return 0;
  }

  return count || 0;
}

// =====================================================
// PROPERTY CATEGORIES (for homepage) - Multi-tenant
// =====================================================

export async function getPropertyCategoriesWithCounts(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select('property_type')
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  if (error) {
    console.error('Error fetching property categories:', error);
    return [];
  }

  // Count properties per type
  const countMap: Record<string, number> = {};
  (data || []).forEach((p) => {
    countMap[p.property_type] = (countMap[p.property_type] || 0) + 1;
  });

  // Map to category objects with labels and images
  const categoryConfig: Record<string, { label: string; image: string }> = {
    apartamento: { label: 'Apartamentos', image: '/images/categories/apartment.jpg' },
    casa: { label: 'Casas', image: '/images/categories/house.jpg' },
    oficina: { label: 'Oficinas', image: '/images/categories/office.jpg' },
    local: { label: 'Locales Comerciales', image: '/images/categories/commercial.jpg' },
    lote: { label: 'Lotes', image: '/images/categories/land.jpg' },
    finca: { label: 'Fincas', image: '/images/categories/farm.jpg' },
    bodega: { label: 'Bodegas', image: '/images/categories/warehouse.jpg' },
    consultorio: { label: 'Consultorios', image: '/images/categories/office.jpg' },
  };

  return Object.entries(countMap).map(([type, count]) => ({
    type,
    label: categoryConfig[type]?.label || type,
    image_url: categoryConfig[type]?.image || '/images/categories/apartment.jpg',
    count,
  }));
}

// Blog categories & related posts → Moved to Sanity CMS (lib/sanity/queries.ts)
