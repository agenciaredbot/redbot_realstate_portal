import type { AirtablePropertyFields, AirtableAgentFields } from './client';

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim();
}

// Map Airtable Transaction_Type to database enum
function mapPropertyStatus(transactionType?: string): 'venta' | 'arriendo' | 'venta_arriendo' {
  if (!transactionType) return 'venta';

  const typeLower = transactionType.toLowerCase();
  if (typeLower.includes('arriendo') && typeLower.includes('venta')) {
    return 'venta_arriendo';
  }
  if (typeLower.includes('arriendo') || typeLower.includes('renta')) {
    return 'arriendo';
  }
  return 'venta';
}

// Map Airtable Property_Type to database enum
function mapPropertyType(
  type?: string
): 'apartamento' | 'casa' | 'oficina' | 'local' | 'lote' | 'finca' | 'bodega' | 'consultorio' {
  if (!type) return 'apartamento';

  const typeLower = type.toLowerCase();
  if (typeLower.includes('casa')) return 'casa';
  if (typeLower.includes('oficina')) return 'oficina';
  if (typeLower.includes('local')) return 'local';
  if (typeLower.includes('lote') || typeLower.includes('terreno')) return 'lote';
  if (typeLower.includes('finca')) return 'finca';
  if (typeLower.includes('bodega')) return 'bodega';
  if (typeLower.includes('consultorio')) return 'consultorio';
  return 'apartamento';
}

// Map Airtable amenities to database format
function mapAmenities(amenities?: string[]): string[] {
  if (!amenities || amenities.length === 0) return [];

  // Normalize amenity names
  return amenities.map((amenity) =>
    amenity
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
  );
}

// Collect all image URLs from Airtable fields
function collectImages(fields: AirtablePropertyFields): string[] {
  const images: string[] = [];

  // Add main photo first
  if (fields.Photo_Main && !fields.Photo_Main.includes('[Requiere')) {
    images.push(fields.Photo_Main);
  }

  // Add extra photos
  if (fields.photo_extra1 && !fields.photo_extra1.includes('[Requiere')) {
    images.push(fields.photo_extra1);
  }
  if (fields.photo_extra2 && !fields.photo_extra2.includes('[Requiere')) {
    images.push(fields.photo_extra2);
  }
  if (fields.photo_extra3 && !fields.photo_extra3.includes('[Requiere')) {
    images.push(fields.photo_extra3);
  }

  return images;
}

/**
 * Map Airtable property record to Supabase format
 */
export function mapAirtablePropertyToSupabase(
  airtableId: string,
  fields: AirtablePropertyFields,
  agentIdMap?: Map<string, string> // Map of Airtable agent IDs to Supabase agent IDs
): Record<string, unknown> {
  const title = fields.Title || 'Sin título';
  const slug = generateSlug(title) + '-' + airtableId.slice(-6);

  // Get agent UUID if linked
  let agentId: string | null = null;
  if (fields.Agent_Assigned && fields.Agent_Assigned.length > 0 && agentIdMap) {
    agentId = agentIdMap.get(fields.Agent_Assigned[0]) || null;
  }

  // Determine if property is active based on Status
  const isActive = fields.Status?.toLowerCase() === 'disponible';

  return {
    airtable_id: airtableId,
    slug,
    title,
    description_short: fields.Description_Short || null,
    description: fields.Description_Full || null,

    // Status and Type
    status: mapPropertyStatus(fields.Transaction_Type),
    property_type: mapPropertyType(fields.Property_Type),
    is_featured: fields.Featured ?? false,
    is_active: isActive,

    // Pricing
    price: fields.Price || 0,
    price_currency: 'COP',
    admin_fee: fields.Maintenance_Fee || fields.HOA_Fee || null,

    // Location
    address: fields.Address || null,
    city: fields.City || 'Bogotá',
    neighborhood: fields.Neighborhood || null,
    latitude: fields.Latitude || null,
    longitude: fields.Longitude || null,

    // Specs
    bedrooms: fields.Bedrooms || 0,
    bathrooms: Math.ceil((fields.Bathrooms || 0) + (fields.Half_Bathrooms || 0) * 0.5),
    parking_spots: fields.Parking_Spaces || 0,
    area_m2: fields.Square_Meters || null,
    area_built_m2: null, // Not in your Airtable
    year_built: fields.Year_Built || null,
    stratum: null, // Not in your Airtable
    floor_number: fields.Floor_Number ? parseInt(fields.Floor_Number) || null : null,
    total_floors: fields.Total_Floors || null,

    // Media
    images: collectImages(fields),
    video_url: fields.Video_URL || fields.Drone_Video_URL || null,
    virtual_tour_url: fields.Virtual_Tour_URL || null,

    // Features
    amenities: mapAmenities(fields.Amenities),

    // Agent
    agent_id: agentId,
  };
}

/**
 * Map Airtable agent record to Supabase format
 */
export function mapAirtableAgentToSupabase(
  airtableId: string,
  fields: AirtableAgentFields
): Record<string, unknown> {
  const fullName = fields.Full_Name || 'Sin Nombre';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || 'Sin';
  const lastName = nameParts.slice(1).join(' ') || 'Nombre';

  const slug = generateSlug(fullName) + '-' + airtableId.slice(-6);

  // Format phone number
  const phone = fields.Phone ? String(fields.Phone) : null;
  const whatsapp = fields.WhatsApp ? String(fields.WhatsApp) : null;

  // Build social links object
  const socialLinks: Record<string, string> = {};
  if (whatsapp) {
    socialLinks.whatsapp = `https://wa.me/${whatsapp}`;
  }

  // Get photo URL (check if it's a placeholder)
  const photoUrl = fields.Photo && !fields.Photo.includes('[Requiere')
    ? fields.Photo
    : null;

  return {
    airtable_id: airtableId,
    slug,
    first_name: firstName,
    last_name: lastName,
    email: fields.Email || `${slug}@placeholder.com`,
    phone: phone,
    bio: null, // Not in your Airtable
    photo_url: photoUrl,
    role: 'Agente Inmobiliario',
    license_number: null,
    years_experience: 0,
    specialties: fields.Specialization || [],
    languages: ['Español'],
    social_links: socialLinks,
    is_active: fields.Active ?? true,
  };
}
