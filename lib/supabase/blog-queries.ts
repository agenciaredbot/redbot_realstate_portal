import { createAdminClient } from './server';
import type { BlogPostDB, BlogCategory, BlogFilters, BlogStats } from '@/types/blog';
import type { BlogPost } from '@/types';

// =====================================================
// BLOG POSTS QUERIES
// =====================================================

/**
 * Get all blog posts with optional filters
 */
export async function getBlogPosts(filters?: BlogFilters): Promise<BlogPostDB[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.is_published !== undefined) {
    query = query.eq('is_published', filters.is_published);
  }

  if (filters?.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured);
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get published blog posts for public pages
 */
export async function getPublishedBlogPosts(limit = 10): Promise<BlogPostDB[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPostDB[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPostById(id: string): Promise<BlogPostDB | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }

  return data;
}

/**
 * Get a single blog post by slug (for public pages)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDB | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }

  return data;
}

/**
 * Get related blog posts by category
 */
export async function getRelatedBlogPosts(
  category: string,
  excludeId: string,
  limit = 3
): Promise<BlogPostDB[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all blog post slugs (for static generation)
 */
export async function getAllBlogPostSlugs(): Promise<{ slug: string }[]> {
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

/**
 * Increment view count for a blog post
 */
export async function incrementBlogViewCount(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.rpc('increment_blog_views', { post_id: id });

  // If RPC doesn't exist, do a regular update
  if (error) {
    await supabase
      .from('blog_posts')
      .update({ views_count: supabase.rpc('coalesce', { value: 'views_count', default: 0 }) })
      .eq('id', id);
  }
}

// =====================================================
// BLOG CATEGORIES QUERIES
// =====================================================

/**
 * Get all blog categories
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Get unique categories from published posts
 */
export async function getUsedBlogCategories(): Promise<string[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching used blog categories:', error);
    return [];
  }

  const categories = [...new Set((data || []).map((p) => p.category).filter(Boolean))];
  return categories as string[];
}

// =====================================================
// BLOG STATS
// =====================================================

/**
 * Get blog statistics for admin dashboard
 */
export async function getBlogStats(): Promise<BlogStats> {
  const supabase = createAdminClient();

  // Get counts
  const [totalResult, publishedResult, featuredResult, viewsResult] = await Promise.all([
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('blog_posts').select('views_count'),
  ]);

  const total = totalResult.count || 0;
  const published = publishedResult.count || 0;
  const featured = featuredResult.count || 0;
  const totalViews = (viewsResult.data || []).reduce((sum, p) => sum + (p.views_count || 0), 0);

  return {
    total,
    published,
    drafts: total - published,
    featured,
    totalViews,
  };
}

// =====================================================
// BLOG MUTATIONS
// =====================================================

/**
 * Create a new blog post
 */
export async function createBlogPost(
  data: Partial<BlogPostDB>
): Promise<BlogPostDB | null> {
  const supabase = createAdminClient();

  // Generate slug if not provided
  if (!data.slug && data.title) {
    data.slug = generateSlug(data.title);
  }

  // Set published_at if publishing
  if (data.is_published && !data.published_at) {
    data.published_at = new Date().toISOString();
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    throw new Error(error.message);
  }

  return post;
}

/**
 * Update a blog post
 */
export async function updateBlogPost(
  id: string,
  data: Partial<BlogPostDB>
): Promise<BlogPostDB | null> {
  const supabase = createAdminClient();

  // Set published_at if publishing for the first time
  if (data.is_published && !data.published_at) {
    // Check if it was previously published
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single();

    if (!existing?.published_at) {
      data.published_at = new Date().toISOString();
    }
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw new Error(error.message);
  }

  return post;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw new Error(error.message);
  }
}

/**
 * Toggle blog post published status
 */
export async function toggleBlogPublished(id: string): Promise<BlogPostDB | null> {
  const supabase = createAdminClient();

  // Get current status
  const { data: current } = await supabase
    .from('blog_posts')
    .select('is_published, published_at')
    .eq('id', id)
    .single();

  if (!current) {
    throw new Error('Post not found');
  }

  const newStatus = !current.is_published;
  const updateData: Partial<BlogPostDB> = {
    is_published: newStatus,
  };

  // Set published_at when publishing for first time
  if (newStatus && !current.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling blog published status:', error);
    throw new Error(error.message);
  }

  return post;
}

/**
 * Toggle blog post featured status
 */
export async function toggleBlogFeatured(id: string): Promise<BlogPostDB | null> {
  const supabase = createAdminClient();

  // Get current status
  const { data: current } = await supabase
    .from('blog_posts')
    .select('is_featured')
    .eq('id', id)
    .single();

  if (!current) {
    throw new Error('Post not found');
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .update({ is_featured: !current.is_featured })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling blog featured status:', error);
    throw new Error(error.message);
  }

  return post;
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 200); // Limit length
}

/**
 * Check if slug exists
 */
export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = createAdminClient();

  let query = supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query.single();

  return !!data;
}

// =====================================================
// ADAPTERS
// =====================================================

/**
 * Adapter: Convert BlogPostDB to BlogPost for public display
 */
export function adaptBlogPostDBToPublic(post: BlogPostDB): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content || '',
    featured_image: post.featured_image && !post.featured_image.includes('placeholder')
      ? post.featured_image
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    author_name: post.author_name || 'Redbot Real Estate',
    author_avatar: post.author_avatar || undefined,
    category: post.category || 'General',
    tags: post.tags || [],
    meta_title: post.meta_title || undefined,
    meta_description: post.meta_description || undefined,
    is_published: post.is_published,
    published_at: post.published_at || post.created_at,
    views_count: post.views_count,
    created_at: post.created_at,
    updated_at: post.updated_at,
  };
}

export function adaptBlogPostsDBToPublic(posts: BlogPostDB[]): BlogPost[] {
  return posts.map(adaptBlogPostDBToPublic);
}
