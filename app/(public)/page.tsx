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
  getTestimonials,
  getBlogPosts,
  getPropertyCategoriesWithCounts,
} from '@/lib/supabase/queries';

export default async function HomePage() {
  // Fetch all data from Supabase in parallel
  const [featuredProperties, recentProperties, agents, testimonials, blogPosts, categories] =
    await Promise.all([
      getFeaturedProperties(6),
      getRecentProperties(9),
      getAgents(),
      getTestimonials(10),
      getBlogPosts(3),
      getPropertyCategoriesWithCounts(),
    ]);

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
      <ServicesSection />

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
