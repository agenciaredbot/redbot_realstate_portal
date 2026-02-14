import type { Metadata } from 'next';
import type { Tenant } from '@/types/tenant';

/**
 * Default metadata for when no tenant is available
 */
const DEFAULT_METADATA: Metadata = {
  title: {
    default: 'Redbot Real Estate | Propiedades en Colombia',
    template: '%s | Redbot Real Estate',
  },
  description:
    'Portal inmobiliario con las mejores propiedades en Colombia. Encuentra casas, apartamentos, villas y mas.',
  keywords: [
    'inmobiliaria',
    'propiedades',
    'casas en venta',
    'apartamentos',
    'bienes raices',
    'Colombia',
  ],
};

/**
 * Generate dynamic metadata based on tenant configuration
 */
export function generateTenantMetadata(tenant: Tenant | null): Metadata {
  if (!tenant) {
    return DEFAULT_METADATA;
  }

  const siteName = tenant.company_name || tenant.name || 'Real Estate Portal';
  const title = tenant.seo_title || `${siteName} | Propiedades`;
  const description = tenant.seo_description ||
    `Portal inmobiliario de ${siteName}. Encuentra las mejores propiedades disponibles.`;

  // Build site URL based on custom domain or subdomain
  let siteUrl = 'https://redbot-realestate.com';
  if (tenant.domain) {
    siteUrl = `https://${tenant.domain}`;
  } else if (tenant.subdomain) {
    siteUrl = `https://${tenant.subdomain}.redbot-realestate.com`;
  }

  // Get images
  const ogImage = tenant.og_image_url || '/images/og-image.jpg';
  const favicon = tenant.favicon_url;

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      'inmobiliaria',
      'propiedades',
      'casas en venta',
      'apartamentos',
      'bienes raices',
      siteName,
      ...(tenant.seo_keywords || []),
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: 'website',
      locale: 'es_CO',
      url: siteUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    icons: favicon ? {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    } : undefined,
    robots: {
      index: tenant.is_active !== false,
      follow: tenant.is_active !== false,
      googleBot: {
        index: tenant.is_active !== false,
        follow: tenant.is_active !== false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Manifest for PWA (if tenant has one)
    ...(tenant.manifest_url ? { manifest: tenant.manifest_url } : {}),
  };
}

/**
 * Generate viewport configuration with tenant theme color
 */
export function generateTenantViewport(tenant: Tenant | null) {
  return {
    themeColor: tenant?.primary_color || '#C9A962',
    width: 'device-width',
    initialScale: 1,
  };
}

/**
 * Generate page-specific metadata with tenant branding
 */
export function generatePageMetadata(
  tenant: Tenant | null,
  pageTitle: string,
  pageDescription?: string,
  pageImage?: string
): Metadata {
  const baseMetadata = generateTenantMetadata(tenant);
  const siteName = tenant?.company_name || tenant?.name || 'Real Estate Portal';

  return {
    ...baseMetadata,
    title: pageTitle,
    description: pageDescription || baseMetadata.description,
    openGraph: {
      ...(baseMetadata.openGraph as object),
      title: `${pageTitle} | ${siteName}`,
      description: pageDescription || (baseMetadata.description as string),
      ...(pageImage ? { images: [{ url: pageImage, width: 1200, height: 630, alt: pageTitle }] } : {}),
    },
    twitter: {
      ...(baseMetadata.twitter as object),
      title: `${pageTitle} | ${siteName}`,
      description: pageDescription || (baseMetadata.description as string),
      ...(pageImage ? { images: [pageImage] } : {}),
    },
  };
}

/**
 * Generate JSON-LD structured data for a real estate business
 */
export function generateTenantJsonLd(tenant: Tenant | null) {
  if (!tenant) return null;

  const siteName = tenant.company_name || tenant.name || 'Real Estate Portal';

  let siteUrl = 'https://redbot-realestate.com';
  if (tenant.domain) {
    siteUrl = `https://${tenant.domain}`;
  } else if (tenant.subdomain) {
    siteUrl = `https://${tenant.subdomain}.redbot-realestate.com`;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: siteName,
    description: tenant.seo_description || `Portal inmobiliario de ${siteName}`,
    url: siteUrl,
    logo: tenant.logo_url || `${siteUrl}/images/logo.png`,
    image: tenant.og_image_url || `${siteUrl}/images/og-image.jpg`,
    telephone: tenant.company_phone,
    email: tenant.company_email,
    address: tenant.company_address ? {
      '@type': 'PostalAddress',
      streetAddress: tenant.company_address,
    } : undefined,
    sameAs: [
      tenant.social_links?.facebook,
      tenant.social_links?.instagram,
      tenant.social_links?.linkedin,
      tenant.social_links?.twitter,
      tenant.social_links?.youtube,
    ].filter(Boolean),
  };
}
