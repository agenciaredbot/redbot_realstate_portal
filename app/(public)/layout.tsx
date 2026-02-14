import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TenantThemeProvider } from '@/components/providers/TenantThemeProvider';
import { generateTenantCSS } from '@/lib/theme-utils';
import { generateTenantMetadata, generateTenantJsonLd, generateTenantViewport } from '@/lib/metadata-utils';
import { getDefaultTenant } from '@/lib/supabase/tenant';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/server';
import type { Tenant } from '@/types/tenant';

// Get tenant from headers (set by middleware)
async function getCurrentTenant(): Promise<Tenant> {
  try {
    const headersList = await headers();
    const tenantId = headersList.get('x-tenant-id');

    if (tenantId) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (data) {
        return data as Tenant;
      }
    }
  } catch (error) {
    console.error('Error getting tenant:', error);
  }

  // Fallback to default tenant
  return getDefaultTenant();
}

// Generate dynamic metadata based on tenant
export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  return generateTenantMetadata(tenant);
}

// Generate dynamic viewport based on tenant
export async function generateViewport(): Promise<Viewport> {
  const tenant = await getCurrentTenant();
  return generateTenantViewport(tenant);
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getCurrentTenant();
  const jsonLd = generateTenantJsonLd(tenant);

  return (
    <TenantThemeProvider tenant={tenant}>
      {/* Inject tenant CSS for SSR */}
      <style dangerouslySetInnerHTML={{ __html: generateTenantCSS(tenant) }} />

      {/* JSON-LD structured data for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="min-h-screen flex flex-col">
        <Navbar tenant={tenant} />
        <main className="flex-1">{children}</main>
        <Footer tenant={tenant} />
      </div>
    </TenantThemeProvider>
  );
}
