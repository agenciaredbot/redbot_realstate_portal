import { sanityClient } from './client';

// =====================================================
// BLOG POSTS QUERIES (from Sanity)
// =====================================================

export async function getBlogPosts(limit = 10) {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "blogPost" && isPublished == true] | order(publishedAt desc) [0...$limit] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        content,
        featuredImage,
        authorName,
        authorAvatar,
        category,
        tags,
        metaTitle,
        metaDescription,
        isPublished,
        publishedAt,
        _createdAt,
        _updatedAt
      }`,
      { limit }
    );
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await sanityClient.fetch(
      `*[_type == "blogPost" && slug.current == $slug && isPublished == true][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        content,
        featuredImage,
        authorName,
        authorAvatar,
        category,
        tags,
        metaTitle,
        metaDescription,
        isPublished,
        publishedAt,
        _createdAt,
        _updatedAt
      }`,
      { slug }
    );
    return post || null;
  } catch (error) {
    console.error('Error fetching blog post from Sanity:', error);
    return null;
  }
}

export async function getAllBlogPostSlugs() {
  try {
    const slugs = await sanityClient.fetch(
      `*[_type == "blogPost" && isPublished == true] { "slug": slug.current }`
    );
    return slugs || [];
  } catch (error) {
    console.error('Error fetching blog post slugs from Sanity:', error);
    return [];
  }
}

export async function getBlogCategories() {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "blogPost" && isPublished == true] { category }`
    );
    const categories = [...new Set((posts || []).map((p: { category: string }) => p.category).filter(Boolean))];
    return categories as string[];
  } catch (error) {
    console.error('Error fetching blog categories from Sanity:', error);
    return [];
  }
}

export async function getRelatedBlogPosts(category: string, excludeSlug: string, limit = 3) {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "blogPost" && isPublished == true && category == $category && slug.current != $excludeSlug] | order(publishedAt desc) [0...$limit] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        featuredImage,
        authorName,
        category,
        publishedAt,
        _createdAt
      }`,
      { category, excludeSlug, limit }
    );
    return posts || [];
  } catch (error) {
    console.error('Error fetching related blog posts from Sanity:', error);
    return [];
  }
}

// =====================================================
// TESTIMONIALS QUERIES (from Sanity)
// =====================================================

export async function getTestimonials(limit = 10) {
  try {
    const testimonials = await sanityClient.fetch(
      `*[_type == "testimonial"] | order(order asc) [0...$limit] {
        _id,
        name,
        role,
        company,
        content,
        photo,
        rating,
        order
      }`,
      { limit }
    );
    return testimonials || [];
  } catch (error) {
    console.error('Error fetching testimonials from Sanity:', error);
    return [];
  }
}

// =====================================================
// PROJECTS QUERIES (from Sanity)
// =====================================================

export async function getProjects(limit = 20) {
  try {
    const projects = await sanityClient.fetch(
      `*[_type == "project" && isActive == true] | order(_createdAt desc) [0...$limit] {
        _id,
        name,
        "slug": slug.current,
        descriptionShort,
        descriptionFull,
        developerName,
        developerLogo,
        city,
        neighborhood,
        address,
        latitude,
        longitude,
        projectType,
        status,
        totalUnits,
        availableUnits,
        floors,
        completionDate,
        priceFrom,
        priceTo,
        currency,
        units,
        amenities,
        images,
        videoUrl,
        brochureUrl,
        virtualTourUrl,
        isFeatured,
        isActive,
        _createdAt,
        _updatedAt
      }`,
      { limit }
    );
    return projects || [];
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await sanityClient.fetch(
      `*[_type == "project" && slug.current == $slug && isActive == true][0] {
        _id,
        name,
        "slug": slug.current,
        descriptionShort,
        descriptionFull,
        developerName,
        developerLogo,
        city,
        neighborhood,
        address,
        latitude,
        longitude,
        projectType,
        status,
        totalUnits,
        availableUnits,
        floors,
        completionDate,
        priceFrom,
        priceTo,
        currency,
        units,
        amenities,
        images,
        videoUrl,
        brochureUrl,
        virtualTourUrl,
        isFeatured,
        isActive,
        _createdAt,
        _updatedAt
      }`,
      { slug }
    );
    return project || null;
  } catch (error) {
    console.error('Error fetching project from Sanity:', error);
    return null;
  }
}

export async function getAllProjectSlugs() {
  try {
    const slugs = await sanityClient.fetch(
      `*[_type == "project" && isActive == true] { "slug": slug.current }`
    );
    return slugs || [];
  } catch (error) {
    console.error('Error fetching project slugs from Sanity:', error);
    return [];
  }
}

export async function getFeaturedProjects(limit = 4) {
  try {
    const projects = await sanityClient.fetch(
      `*[_type == "project" && isActive == true && isFeatured == true] | order(_createdAt desc) [0...$limit] {
        _id,
        name,
        "slug": slug.current,
        descriptionShort,
        developerName,
        city,
        neighborhood,
        projectType,
        status,
        totalUnits,
        availableUnits,
        priceFrom,
        priceTo,
        currency,
        images,
        isFeatured,
        _createdAt
      }`,
      { limit }
    );
    return projects || [];
  } catch (error) {
    console.error('Error fetching featured projects from Sanity:', error);
    return [];
  }
}

// =====================================================
// SERVICES QUERIES (from Sanity)
// =====================================================

export async function getServices() {
  try {
    const services = await sanityClient.fetch(
      `*[_type == "service"] | order(order asc) {
        _id,
        title,
        description,
        icon,
        order
      }`
    );
    return services || [];
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return [];
  }
}
