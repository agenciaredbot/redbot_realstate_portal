'use client';

// =====================================================
// TENANT CONTEXT - React Context for Multi-tenant
// =====================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Tenant, TenantContextValue, applyTenantTheme } from '@/types/tenant';

// Create context with default value
const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

// Props for the provider
interface TenantProviderProps {
  children: ReactNode;
  initialTenant?: Tenant | null;
}

/**
 * TenantProvider - Provides tenant context to the app
 * Can be initialized with server-side tenant data or fetch client-side
 */
export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant);
  const [isLoading, setIsLoading] = useState(!initialTenant);
  const [error, setError] = useState<string | null>(null);

  // Fetch tenant data (client-side fallback)
  const fetchTenant = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tenant');

      if (!response.ok) {
        throw new Error('Failed to fetch tenant');
      }

      const data = await response.json();
      setTenant(data.tenant);
    } catch (err) {
      console.error('Error fetching tenant:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchTenant();
  }, [fetchTenant]);

  // Fetch on mount if no initial tenant
  useEffect(() => {
    if (!initialTenant && !tenant) {
      fetchTenant();
    }
  }, [initialTenant, tenant, fetchTenant]);

  // Apply theme when tenant changes
  useEffect(() => {
    if (tenant) {
      applyTenantTheme(tenant);
    }
  }, [tenant]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error, refetch }}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook to access tenant context
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
}

/**
 * Hook to get the current tenant (throws if not loaded)
 */
export function useRequiredTenant(): Tenant {
  const { tenant, isLoading, error } = useTenant();

  if (isLoading) {
    throw new Error('Tenant is still loading');
  }

  if (error) {
    throw new Error(`Failed to load tenant: ${error}`);
  }

  if (!tenant) {
    throw new Error('No tenant available');
  }

  return tenant;
}

/**
 * Hook to check if a feature is enabled for the current tenant
 */
export function useTenantFeature(feature: keyof Tenant['features']): boolean {
  const { tenant } = useTenant();

  if (!tenant) {
    return false;
  }

  return tenant.features[feature] === true;
}

/**
 * Hook to get tenant branding
 */
export function useTenantBranding() {
  const { tenant } = useTenant();

  return {
    logoUrl: tenant?.logo_url || '/images/logo.png',
    logoDarkUrl: tenant?.logo_dark_url || tenant?.logo_url || '/images/logo-dark.png',
    faviconUrl: tenant?.favicon_url || '/favicon.ico',
    primaryColor: tenant?.primary_color || '#C9A962',
    secondaryColor: tenant?.secondary_color || '#1A1A1A',
    accentColor: tenant?.accent_color || '#FFFFFF',
    companyName: tenant?.company_name || tenant?.name || 'Redbot Real Estate',
  };
}

/**
 * Hook to get tenant contact info
 */
export function useTenantContact() {
  const { tenant } = useTenant();

  return {
    email: tenant?.company_email || '',
    phone: tenant?.company_phone || '',
    address: tenant?.company_address || '',
    whatsapp: tenant?.company_whatsapp || tenant?.company_phone || '',
    socialLinks: tenant?.social_links || {},
  };
}

/**
 * Hook to get tenant SEO defaults
 */
export function useTenantSEO() {
  const { tenant } = useTenant();

  return {
    title: tenant?.seo_title || tenant?.name || 'Real Estate Portal',
    description: tenant?.seo_description || '',
    keywords: tenant?.seo_keywords || [],
  };
}

/**
 * Hook to get tenant limits
 */
export function useTenantLimits() {
  const { tenant } = useTenant();

  return {
    maxProperties: tenant?.max_properties || 10,
    maxAgents: tenant?.max_agents || 1,
    maxStorageMb: tenant?.max_storage_mb || 500,
    plan: tenant?.plan || 'free',
  };
}

// Export context for advanced use cases
export { TenantContext };
