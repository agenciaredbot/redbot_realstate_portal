/**
 * Adapters to transform Sanity document shapes into the existing TypeScript types
 * used throughout the app (BlogPost, Project, Testimonial, Service).
 *
 * This allows us to switch data sources without changing components.
 */

import type { BlogPost, Testimonial, Service } from '@/types';
import type { Project, ProjectImage, ProjectUnit } from '@/types/project';
import { urlFor } from './client';

// =====================================================
// BLOG POST ADAPTER
// =====================================================

export function adaptSanityBlogPost(doc: any): BlogPost {
  // For featured image: Sanity stores images as objects, we need a URL string
  let featuredImage = '/images/placeholder-blog.jpg';
  if (doc.featuredImage?.asset) {
    featuredImage = urlFor(doc.featuredImage).width(1200).url();
  } else if (typeof doc.featuredImage === 'string') {
    featuredImage = doc.featuredImage;
  }

  // For author avatar
  let authorAvatar: string | undefined;
  if (doc.authorAvatar?.asset) {
    authorAvatar = urlFor(doc.authorAvatar).width(200).url();
  } else if (typeof doc.authorAvatar === 'string') {
    authorAvatar = doc.authorAvatar;
  }

  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt || '',
    content: doc.content || '', // Portable Text - will be rendered differently
    featured_image: featuredImage,
    author_name: doc.authorName || 'Redbot Real Estate',
    author_avatar: authorAvatar,
    category: doc.category || '',
    tags: doc.tags || [],
    meta_title: doc.metaTitle,
    meta_description: doc.metaDescription,
    is_published: doc.isPublished ?? true,
    published_at: doc.publishedAt || doc._createdAt,
    views_count: 0,
    created_at: doc._createdAt,
    updated_at: doc._updatedAt,
  };
}

// =====================================================
// TESTIMONIAL ADAPTER
// =====================================================

export function adaptSanityTestimonial(doc: any): Testimonial {
  let photoUrl: string | undefined;
  if (doc.photo?.asset) {
    photoUrl = urlFor(doc.photo).width(200).url();
  } else if (typeof doc.photo === 'string') {
    photoUrl = doc.photo;
  }

  return {
    id: doc._id,
    name: doc.name,
    role: doc.role || '',
    company: doc.company,
    content: doc.content,
    photo_url: photoUrl,
    rating: doc.rating || 5,
    order: doc.order || 0,
  };
}

// =====================================================
// PROJECT ADAPTER
// =====================================================

export function adaptSanityProject(doc: any): Project {
  // Adapt images array
  const images: ProjectImage[] = (doc.images || []).map((img: any, index: number) => ({
    id: img._key || `img-${index}`,
    url: img.asset ? urlFor(img).width(1200).url() : (typeof img === 'string' ? img : '/images/placeholder-project.jpg'),
    alt: img.alt || doc.name,
    order: index + 1,
    is_main: index === 0,
  }));

  // If no images from Sanity, use placeholder
  if (images.length === 0) {
    images.push({
      id: 'placeholder',
      url: '/images/placeholder-project.jpg',
      alt: doc.name,
      order: 1,
      is_main: true,
    });
  }

  // Adapt units array
  const units: ProjectUnit[] = (doc.units || []).map((unit: any) => ({
    type: unit.type,
    area_min: unit.areaMin || 0,
    area_max: unit.areaMax || 0,
    price_from: unit.priceFrom || 0,
    available: unit.available || 0,
  }));

  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.name,
    description_short: doc.descriptionShort || '',
    description_full: doc.descriptionFull || '', // Portable Text, rendered separately
    developer_name: doc.developerName || '',
    developer_logo: doc.developerLogo?.asset ? urlFor(doc.developerLogo).width(200).url() : doc.developerLogo,
    city: doc.city || '',
    neighborhood: doc.neighborhood || '',
    address: doc.address,
    latitude: doc.latitude,
    longitude: doc.longitude,
    project_type: doc.projectType || 'Residencial',
    status: doc.status || 'En Construccion',
    total_units: doc.totalUnits || 0,
    available_units: doc.availableUnits || 0,
    floors: doc.floors,
    completion_date: doc.completionDate,
    price_from: doc.priceFrom || 0,
    price_to: doc.priceTo || 0,
    currency: doc.currency || 'COP',
    units,
    amenities: doc.amenities || [],
    images,
    video_url: doc.videoUrl,
    brochure_url: doc.brochureUrl,
    virtual_tour_url: doc.virtualTourUrl,
    is_featured: doc.isFeatured ?? false,
    is_active: doc.isActive ?? true,
    views_count: 0,
    created_at: doc._createdAt,
    updated_at: doc._updatedAt,
  };
}

// =====================================================
// SERVICE ADAPTER
// =====================================================

export function adaptSanityService(doc: any): Service {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    icon: doc.icon || 'Home',
    order: doc.order || 0,
  };
}

// =====================================================
// BATCH ADAPTERS
// =====================================================

export function adaptSanityBlogPosts(docs: any[]): BlogPost[] {
  return (docs || []).map(adaptSanityBlogPost);
}

export function adaptSanityTestimonials(docs: any[]): Testimonial[] {
  return (docs || []).map(adaptSanityTestimonial);
}

export function adaptSanityProjects(docs: any[]): Project[] {
  return (docs || []).map(adaptSanityProject);
}

export function adaptSanityServices(docs: any[]): Service[] {
  return (docs || []).map(adaptSanityService);
}
