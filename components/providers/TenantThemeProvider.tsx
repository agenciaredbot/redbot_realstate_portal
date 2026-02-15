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

  // Determine the main accent color for the UI
  // Priority: accent_color_2 > primary_color > default gold
  // accent_color_2 is the visible accent color (e.g., orange for Luxury Homes)
  const mainAccentColor = tenant.accent_color_2 || tenant.primary_color || '#C9A962';
  const mainAccentHSL = hexToHSL(mainAccentColor);

  if (mainAccentHSL) {
    // Set the main UI accent color (used by text-luxus-gold, bg-luxus-gold, etc.)
    root.style.setProperty('--color-luxus-gold', mainAccentColor);
    root.style.setProperty('--color-primary', mainAccentColor);
    root.style.setProperty('--primary', `${mainAccentHSL.h} ${mainAccentHSL.s}% ${mainAccentHSL.l}%`);

    // Generate hover/active variants from the main accent color
    root.style.setProperty('--color-luxus-gold-hover', adjustBrightness(mainAccentColor, -10));
    root.style.setProperty('--color-luxus-gold-light', adjustBrightness(mainAccentColor, 40));
    root.style.setProperty('--color-luxus-gold-dark', adjustBrightness(mainAccentColor, -15));

    // Also set accent variables
    root.style.setProperty('--color-accent', mainAccentColor);
    root.style.setProperty('--color-accent-2', mainAccentColor);
    root.style.setProperty('--accent', `${mainAccentHSL.h} ${mainAccentHSL.s}% ${mainAccentHSL.l}%`);
    root.style.setProperty('--ring', `${mainAccentHSL.h} ${mainAccentHSL.s}% ${mainAccentHSL.l}%`);
  }

  // Secondary color (dark) - used for footer background, etc.
  if (tenant.secondary_color) {
    const secondaryHSL = hexToHSL(tenant.secondary_color);
    if (secondaryHSL) {
      root.style.setProperty('--color-luxus-dark', tenant.secondary_color);
      root.style.setProperty('--color-secondary', tenant.secondary_color);
      root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
    }
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
  }, [tenant.primary_color, tenant.secondary_color, tenant.accent_color, tenant.accent_color_2, tenant.favicon_url]);

  return (
    <TenantProvider initialTenant={tenant}>
      {children}
    </TenantProvider>
  );
}
