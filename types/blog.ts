// =====================================================
// BLOG TYPES
// =====================================================

export interface BlogPostDB {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;

  // Author
  author_id: string | null;
  author_name: string | null;
  author_avatar: string | null;

  // Categorization
  category: string | null;
  tags: string[] | null;

  // SEO
  meta_title: string | null;
  meta_description: string | null;

  // Status
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;

  // Metrics
  views_count: number;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Joined relations
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface BlogFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  is_featured: boolean;
}

export interface BlogFilters {
  search?: string;
  category?: string;
  is_published?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
  totalViews: number;
}

// For admin table display
export interface BlogPostWithStats extends BlogPostDB {
  _count?: {
    views: number;
  };
}
