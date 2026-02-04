import { createServerSupabaseClient, createAdminClient } from './server';
import type { Property, Agent, PropertyFilters } from '@/types';

// =====================================================
// PROPERTIES QUERIES
// =====================================================

export async function getProperties(filters?: PropertyFilters) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('properties')
    .select(`
      *,
      agent:agents(id, slug, first_name, last_name, photo_url, phone, email)
    `)
    .eq('is_active', true);

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

export async function getPropertyBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
}

export async function getFeaturedProperties(limit = 6) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(id, slug, first_name, last_name, photo_url)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return data || [];
}

export async function getRecentProperties(limit = 9) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(id, slug, first_name, last_name, photo_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent properties:', error);
    return [];
  }

  return data || [];
}

// =====================================================
// AGENTS QUERIES
// =====================================================

export async function getAgents() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

export async function getAgentBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching agent:', error);
    return null;
  }

  return data;
}

export async function getAgentWithProperties(slug: string) {
  const supabase = await createServerSupabaseClient();

  // Get agent
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('*')
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
    .eq('agent_id', agent.id)
    .eq('is_active', true)
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
// TESTIMONIALS QUERIES
// =====================================================

export async function getTestimonials(limit = 10) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data || [];
}

// =====================================================
// BLOG POSTS QUERIES
// =====================================================

export async function getBlogPosts(limit = 10) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data;
}

// =====================================================
// PROJECTS QUERIES
// =====================================================

export async function getProjects(limit = 10) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function getFeaturedProjects(limit = 4) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return data || [];
}

// =====================================================
// CONTACT SUBMISSIONS
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
}) {
  // Use admin client to bypass RLS for insert
  const supabase = createAdminClient();

  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
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
// SITE SETTINGS
// =====================================================

export async function getSiteSetting(key: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }

  return data?.value;
}

export async function getAllSiteSettings() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

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
// These use admin client to avoid cookies dependency
// =====================================================

export async function getAllPropertySlugs() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select('slug')
    .eq('is_active', true);

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
    .select('slug')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching agent slugs:', error);
    return [];
  }

  return data || [];
}

export async function getAllBlogPostSlugs() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching blog post slugs:', error);
    return [];
  }

  return data || [];
}

export async function getAllProjectSlugs() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('slug')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching project slugs:', error);
    return [];
  }

  return data || [];
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export async function getCities() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('properties')
    .select('city')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Get unique cities
  const cities = [...new Set(data?.map((p) => p.city) || [])];
  return cities.sort();
}

export async function getPropertyTypes() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('properties')
    .select('property_type')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching property types:', error);
    return [];
  }

  // Get unique types
  const types = [...new Set(data?.map((p) => p.property_type) || [])];
  return types;
}

export async function getPropertiesCount() {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching properties count:', error);
    return 0;
  }

  return count || 0;
}

export async function getAgentsCount() {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching agents count:', error);
    return 0;
  }

  return count || 0;
}
