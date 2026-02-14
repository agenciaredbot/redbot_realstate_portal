// =====================================================
// THEME UTILITIES - Server-safe functions
// =====================================================

import type { Tenant } from '@/types/tenant';

/**
 * Converts hex color to HSL values for CSS variables
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Adjust brightness of a hex color
 */
export function adjustBrightness(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '');

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.max(0, r + (r * percent) / 100));
  g = Math.min(255, Math.max(0, g + (g * percent) / 100));
  b = Math.min(255, Math.max(0, b + (b * percent) / 100));

  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Generate CSS string for tenant theme (server-safe)
 */
export function generateTenantCSS(tenant: Tenant): string {
  const primaryColor = tenant.primary_color || '#C9A962';
  const secondaryColor = tenant.secondary_color || '#1A1A1A';

  const primaryHSL = hexToHSL(primaryColor);
  const secondaryHSL = hexToHSL(secondaryColor);

  return `
    :root {
      --color-luxus-gold: ${primaryColor};
      --color-luxus-dark: ${secondaryColor};
      --color-primary: ${primaryColor};
      --color-secondary: ${secondaryColor};
      --color-luxus-gold-hover: ${adjustBrightness(primaryColor, -10)};
      --color-luxus-gold-light: ${adjustBrightness(primaryColor, 40)};
      ${primaryHSL ? `--primary: ${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%;` : ''}
      ${secondaryHSL ? `--secondary: ${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%;` : ''}
    }
  `;
}
