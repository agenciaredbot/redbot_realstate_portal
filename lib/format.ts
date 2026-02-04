/**
 * Format price in Colombian Pesos (COP)
 */
export function formatPriceCOP(
  price: number,
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
  }
): string {
  const { showDecimals = false, compact = false } = options || {};

  if (compact) {
    if (price >= 1_000_000_000) {
      return `$${(price / 1_000_000_000).toFixed(1).replace('.0', '')} Mil M`;
    }
    if (price >= 1_000_000) {
      return `$${(price / 1_000_000).toFixed(1).replace('.0', '')} M`;
    }
    if (price >= 1_000) {
      return `$${(price / 1_000).toFixed(0)} K`;
    }
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price);
}

/**
 * Format price in USD
 */
export function formatPriceUSD(
  price: number,
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
  }
): string {
  const { showDecimals = false, compact = false } = options || {};

  if (compact) {
    if (price >= 1_000_000) {
      return `$${(price / 1_000_000).toFixed(1).replace('.0', '')}M`;
    }
    if (price >= 1_000) {
      return `$${(price / 1_000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price);
}

/**
 * Format price based on currency
 */
export function formatPrice(
  price: number,
  currency: 'COP' | 'USD' = 'COP',
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
  }
): string {
  if (currency === 'USD') {
    return formatPriceUSD(price, options);
  }
  return formatPriceCOP(price, options);
}

/**
 * Format area in square meters
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('es-CO')} m²`;
}

/**
 * Format price with frequency (for rentals)
 */
export function formatPriceWithFrequency(
  price: number,
  currency: 'COP' | 'USD',
  frequency?: 'mes' | 'ano' | 'dia' | null
): string {
  const formattedPrice = formatPrice(price, currency);

  if (!frequency) return formattedPrice;

  const frequencyLabels = {
    mes: '/mes',
    ano: '/año',
    dia: '/día',
  };

  return `${formattedPrice}${frequencyLabels[frequency]}`;
}

/**
 * Format date in Spanish locale
 */
export function formatDate(
  date: string | Date,
  options?: {
    includeTime?: boolean;
    relative?: boolean;
  }
): string {
  const { includeTime = false, relative = false } = options || {};
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }

  return dateObj.toLocaleDateString('es-CO', dateOptions);
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Colombian phone format: +57 XXX XXX XXXX
  if (digits.startsWith('57') && digits.length === 12) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  // 10-digit Colombian number
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone;
}

/**
 * Create WhatsApp link
 */
export function createWhatsAppLink(
  phone: string,
  message?: string
): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Add country code if not present
  if (digits.length === 10) {
    digits = `57${digits}`;
  }

  const baseUrl = `https://wa.me/${digits}`;

  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }

  return baseUrl;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Create slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .trim();
}
