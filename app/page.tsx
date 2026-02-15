import { headers } from 'next/headers';

// Marketing Landing Page Components
import MarketingHomePage from './(marketing)/page';

// Tenant Portal Components
import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FreshListings } from '@/components/home/FreshListings';
import { AgentsCarousel } from '@/components/home/AgentsCarousel';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { BlogPreview } from '@/components/home/BlogPreview';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TenantThemeProvider } from '@/components/providers/TenantThemeProvider';
import { getDefaultTenant } from '@/lib/supabase/tenant';
import { createAdminClient } from '@/lib/supabase/server';
import type { Tenant } from '@/types/tenant';
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

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Main domains that show marketing landing
const MAIN_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'redbot.app',
  'www.redbot.app',
  'redbot-portal.vercel.app',
  'redbot-realstate-portal.vercel.app',
];

export default async function HomePage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0];

  // Check if we're on a main domain (show marketing landing)
  const isMainDomain = MAIN_DOMAINS.includes(hostname);

  if (isMainDomain) {
    // Show marketing landing page
    return <MarketingHomePage />;
  }

  // We're on a tenant subdomain - show their portal
  // Get tenant from subdomain
  let tenant: Tenant = await getDefaultTenant();

  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const subdomain = parts[0];
    const supabase = createAdminClient();
    const { data: tenantData } = await supabase
      .from('tenants')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .single();

    if (tenantData) {
      tenant = tenantData as Tenant;
    }
  }

  // Debug: log tenant data to check values
  console.log('Tenant loaded:', {
    name: tenant.name,
    subdomain: tenant.subdomain,
    primary_color: tenant.primary_color,
    hero_title: tenant.hero_title,
    hero_subtitle: tenant.hero_subtitle,
  });

  // Fetch tenant-specific data
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

  // Adapt data
  const testimonials = adaptSanityTestimonials(sanityTestimonials);
  const blogPosts = adaptBlogPostsDBToPublic(supabaseBlogPosts);
  const services = adaptSanityServices(sanityServices);

  // Create agents map
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
    <TenantThemeProvider tenant={tenant}>
      <div className="min-h-screen flex flex-col">
        <Navbar tenant={tenant} />
        <main className="flex-1">
          <Hero tenant={tenant} />
          <AboutSection tenant={tenant} />
          <CategoriesSection categories={categories} />
          <FeaturedListings properties={featuredProperties} agents={agentsMap} />
          <ServicesSection services={services} />
          <FreshListings properties={recentProperties} agents={agentsMap} />
          <AgentsCarousel agents={agents} />
          <TestimonialsCarousel testimonials={testimonials} />
          <BlogPreview posts={blogPosts} />
        </main>
        <Footer tenant={tenant} />
      </div>
    </TenantThemeProvider>
  );
}
