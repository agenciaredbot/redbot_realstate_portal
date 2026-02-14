'use client';

import { useEffect } from 'react';
import { TenantProvider } from '@/lib/context/tenant-context';
import { hexToHSL, adjustBrightness } from '@/lib/theme-utils';
import type { Tenant } from '@/types/tenant';

interface TenantThemeProviderProps {
  tenant: Tenant;
  children: React.ReactNode;
}

/**
 * Apply tenant theme CSS variables to document root (client-side)
 */
function applyTenantTheme(tenant: Tenant) {
  const root = document.documentElement;

  // Primary color
  if (tenant.primary_color) {
    const primaryHSL = hexToHSL(tenant.primary_color);
    if (primaryHSL) {
      root.style.setProperty('--color-luxus-gold', tenant.primary_color);
      root.style.setProperty('--color-primary', tenant.primary_color);
      root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);

      // Generate hover/active variants
      root.style.setProperty('--color-luxus-gold-hover', adjustBrightness(tenant.primary_color, -10));
      root.style.setProperty('--color-luxus-gold-light', adjustBrightness(tenant.primary_color, 40));
    }
  }

  // Secondary color (dark)
  if (tenant.secondary_color) {
    const secondaryHSL = hexToHSL(tenant.secondary_color);
    if (secondaryHSL) {
      root.style.setProperty('--color-luxus-dark', tenant.secondary_color);
      root.style.setProperty('--color-secondary', tenant.secondary_color);
      root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
    }
  }

  // Accent color
  if (tenant.accent_color) {
    root.style.setProperty('--color-accent', tenant.accent_color);
  }

  // Update favicon if provided
  if (tenant.favicon_url) {
    updateFavicon(tenant.favicon_url);
  }

  // Update document title with tenant name
  if (tenant.seo_title) {
    // Don't override page-specific titles, just set the base
    document.title = document.title.includes('|')
      ? document.title
      : tenant.seo_title;
  }
}

/**
 * Update favicon dynamically
 */
function updateFavicon(url: string) {
  // Remove existing favicon
  const existingLink = document.querySelector("link[rel*='icon']");
  if (existingLink) {
    existingLink.remove();
  }

  // Add new favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Reset theme to defaults
 */
function resetTheme() {
  const root = document.documentElement;

  // Reset to default Redbot colors
  root.style.setProperty('--color-luxus-gold', '#C9A962');
  root.style.setProperty('--color-luxus-dark', '#1A1A1A');
  root.style.setProperty('--color-primary', '#C9A962');
  root.style.setProperty('--color-secondary', '#1A1A1A');
  root.style.setProperty('--color-luxus-gold-hover', '#B8983F');
  root.style.setProperty('--color-luxus-gold-light', '#F5ECD5');
}

export function TenantThemeProvider({ tenant, children }: TenantThemeProviderProps) {
  useEffect(() => {
    // Apply theme on mount
    applyTenantTheme(tenant);

    // Cleanup on unmount (reset to defaults)
    return () => {
      resetTheme();
    };
  }, [tenant]);

  // Re-apply if tenant changes
  useEffect(() => {
    applyTenantTheme(tenant);
  }, [tenant.primary_color, tenant.secondary_color, tenant.accent_color, tenant.favicon_url]);

  return (
    <TenantProvider initialTenant={tenant}>
      {children}
    </TenantProvider>
  );
}
