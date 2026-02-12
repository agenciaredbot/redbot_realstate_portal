import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FreshListings } from '@/components/home/FreshListings';
import { AgentsCarousel } from '@/components/home/AgentsCarousel';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { BlogPreview } from '@/components/home/BlogPreview';
import {
  getFeaturedProperties,
  getRecentProperties,
  getAgents,
  getPropertyCategoriesWithCounts,
} from '@/lib/supabase/queries';
import {
  getPublishedBlogPosts,
  adaptBlogPostsDBToPublic,
} from '@/lib/supabase/blog-queries';
import {
  getTestimonials as getSanityTestimonials,
  getServices as getSanityServices,
} from '@/lib/sanity/queries';
import {
  adaptSanityTestimonials,
  adaptSanityServices,
} from '@/lib/sanity/adapters';

// Make page dynamic so property changes (active/inactive) reflect immediately
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data from Supabase (properties, agents, categories, blog) and Sanity (testimonials, services) in parallel
  const [featuredProperties, recentProperties, agents, sanityTestimonials, supabaseBlogPosts, categories, sanityServices] =
    await Promise.all([
      getFeaturedProperties(6),
      getRecentProperties(9),
      getAgents(),
      getSanityTestimonials(10),
      getPublishedBlogPosts(3),
      getPropertyCategoriesWithCounts(),
      getSanityServices(),
    ]);

  // Adapt data to match existing TypeScript types
  const testimonials = adaptSanityTestimonials(sanityTestimonials);
  const blogPosts = adaptBlogPostsDBToPublic(supabaseBlogPosts);
  const services = adaptSanityServices(sanityServices);

  // Create agents map for property cards
  const agentsMap = agents.reduce(
    (acc, agent) => {
      acc[agent.id] = {
        id: agent.id,
        slug: agent.slug,
        first_name: agent.first_name,
        last_name: agent.last_name,
        full_name: `${agent.first_name} ${agent.last_name}`,
        photo_url: agent.photo_url,
      };
      return acc;
    },
    {} as Record<string, { id: string; slug: string; first_name: string; last_name: string; full_name: string; photo_url: string | null }>
  );

  return (
    <>
      {/* Hero Section with Search */}
      <Hero />

      {/* About Section with Stats */}
      <AboutSection />

      {/* Property Categories */}
      <CategoriesSection categories={categories} />

      {/* Featured/Exclusive Listings */}
      <FeaturedListings properties={featuredProperties} agents={agentsMap} />

      {/* Our Services */}
      <ServicesSection services={services} />

      {/* Fresh Listings with Tabs */}
      <FreshListings properties={recentProperties} agents={agentsMap} />

      {/* Our Agents */}
      <AgentsCarousel agents={agents} />

      {/* Testimonials */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* Blog Preview */}
      <BlogPreview posts={blogPosts} />
    </>
  );
}
