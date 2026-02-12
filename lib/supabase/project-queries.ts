import { createAdminClient } from './server';
import type { ProjectDB, ProjectFilters, ProjectStats } from '@/types/project-db';
import type { Project, ProjectImage } from '@/types/project';

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Generate a URL-friendly slug from project name
 */
export function generateProjectSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove multiple dashes
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .substring(0, 200);
}

/**
 * Map DB status to display status
 */
function mapStatusToDisplay(status: string): string {
  const statusMap: Record<string, string> = {
    preventa: 'Preventa',
    en_construccion: 'En Construccion',
    entrega_inmediata: 'Entrega Inmediata',
    vendido: 'Vendido',
  };
  return statusMap[status] || status;
}

/**
 * Adapter: Convert ProjectDB to Project for public display
 */
export function adaptProjectDBToPublic(project: ProjectDB): Project {
  // Convert images array to ProjectImage array
  const images: ProjectImage[] = (project.images || []).map((url, index) => ({
    id: `img-${index}`,
    url,
    alt: project.name,
    order: index + 1,
    is_main: index === 0,
  }));

  // Add placeholder if no images
  if (images.length === 0) {
    images.push({
      id: 'placeholder',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
      alt: project.name,
      order: 1,
      is_main: true,
    });
  }

  return {
    id: project.id,
    slug: project.slug,
    title: project.name,
    description_short: project.description_short || '',
    description_full: project.description || '',
    developer_name: project.developer || '',
    developer_logo: project.logo_url || undefined,
    city: project.city,
    neighborhood: project.neighborhood || '',
    address: project.address || undefined,
    latitude: project.latitude || undefined,
    longitude: project.longitude || undefined,
    project_type: 'Residencial', // Default, could be added to DB
    status: mapStatusToDisplay(project.status) as Project['status'],
    total_units: project.total_units || 0,
    available_units: project.available_units || 0,
    floors: undefined,
    completion_date: project.completion_date || undefined,
    price_from: project.price_from || 0,
    price_to: project.price_to || 0,
    currency: (project.price_currency as 'COP' | 'USD') || 'COP',
    units: (project.unit_types || []).map((type) => ({
      type,
      area_min: project.area_from || 0,
      area_max: project.area_to || 0,
      price_from: project.price_from || 0,
      available: Math.floor((project.available_units || 0) / (project.unit_types?.length || 1)),
    })),
    amenities: project.amenities || [],
    images,
    video_url: project.video_url || undefined,
    brochure_url: project.brochure_url || undefined,
    virtual_tour_url: undefined,
    is_featured: project.is_featured,
    is_active: project.is_active,
    views_count: 0,
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}

export function adaptProjectsDBToPublic(projects: ProjectDB[]): Project[] {
  return projects.map(adaptProjectDBToPublic);
}

// =====================================================
// READ OPERATIONS
// =====================================================

/**
 * Get all projects with optional filters
 */
export async function getProjects(filters?: ProjectFilters): Promise<ProjectDB[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  if (filters?.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description_short.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get active projects for public pages
 */
export async function getActiveProjects(limit = 20): Promise<ProjectDB[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching active projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(limit = 4): Promise<ProjectDB[]> {
  const supabase = createAdminClient();

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

/**
 * Get a single project by ID
 */
export async function getProjectById(id: string): Promise<ProjectDB | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project by ID:', error);
    return null;
  }

  return data;
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDB | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }

  return data;
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('slug')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching project slugs:', error);
    return [];
  }

  return (data || []).map((p) => p.slug);
}

/**
 * Get project statistics
 */
export async function getProjectStats(): Promise<ProjectStats> {
  const supabase = createAdminClient();

  const [
    totalResult,
    activeResult,
    featuredResult,
    preventaResult,
    construccionResult,
    entregaResult,
    vendidoResult,
  ] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'preventa'),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'en_construccion'),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'entrega_inmediata'),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'vendido'),
  ]);

  return {
    total: totalResult.count || 0,
    active: activeResult.count || 0,
    featured: featuredResult.count || 0,
    preventa: preventaResult.count || 0,
    en_construccion: construccionResult.count || 0,
    entrega_inmediata: entregaResult.count || 0,
    vendido: vendidoResult.count || 0,
  };
}

/**
 * Check if a slug already exists
 */
export async function checkProjectSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = createAdminClient();

  let query = supabase
    .from('projects')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query.single();

  return !!data;
}

/**
 * Get unique cities from projects
 */
export async function getProjectCities(): Promise<string[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('city')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching project cities:', error);
    return [];
  }

  const cities = [...new Set((data || []).map((p) => p.city).filter(Boolean))];
  return cities.sort();
}

// =====================================================
// WRITE OPERATIONS (Admin)
// =====================================================

/**
 * Create a new project
 */
export async function createProject(data: Partial<ProjectDB>): Promise<ProjectDB | null> {
  const supabase = createAdminClient();

  // Generate slug if not provided
  if (!data.slug && data.name) {
    data.slug = generateProjectSlug(data.name);
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(error.message);
  }

  return project;
}

/**
 * Update a project
 */
export async function updateProject(id: string, data: Partial<ProjectDB>): Promise<ProjectDB | null> {
  const supabase = createAdminClient();

  const { data: project, error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw new Error(error.message);
  }

  return project;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw new Error(error.message);
  }

  return true;
}

/**
 * Toggle project featured status
 */
export async function toggleProjectFeatured(id: string): Promise<ProjectDB | null> {
  const supabase = createAdminClient();

  // Get current status
  const { data: current } = await supabase
    .from('projects')
    .select('is_featured')
    .eq('id', id)
    .single();

  if (!current) {
    throw new Error('Proyecto no encontrado');
  }

  const { data: project, error } = await supabase
    .from('projects')
    .update({ is_featured: !current.is_featured })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling project featured:', error);
    throw new Error(error.message);
  }

  return project;
}

/**
 * Toggle project active status
 */
export async function toggleProjectActive(id: string): Promise<ProjectDB | null> {
  const supabase = createAdminClient();

  // Get current status
  const { data: current } = await supabase
    .from('projects')
    .select('is_active')
    .eq('id', id)
    .single();

  if (!current) {
    throw new Error('Proyecto no encontrado');
  }

  const { data: project, error } = await supabase
    .from('projects')
    .update({ is_active: !current.is_active })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling project active:', error);
    throw new Error(error.message);
  }

  return project;
}
