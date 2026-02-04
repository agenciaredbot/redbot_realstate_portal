/**
 * Mappers para transformar datos de formularios a estructuras de GoHighLevel
 */

import type { GHLContact, GHLOpportunity } from './client';

/**
 * Datos del formulario de contacto (página /contacto)
 */
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType?: string;
  message: string;
}

/**
 * Datos del formulario de propiedad (sidebar de /propiedades/[slug])
 */
export interface PropertyContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  agentId?: string;
  agentName?: string;
}

/**
 * Mapeo de tipo de consulta a tags de GHL
 */
const INQUIRY_TYPE_TAGS: Record<string, string> = {
  comprar: 'Interesado en Comprar',
  vender: 'Interesado en Vender',
  arrendar: 'Interesado en Arrendar',
  inversion: 'Inversionista',
  propiedad: 'Consulta Propiedad',
  otro: 'Consulta General',
};

/**
 * Mapea datos del formulario de contacto general a contacto GHL
 */
export function mapContactFormToGHL(form: ContactFormData): {
  contact: Omit<GHLContact, 'id'>;
  tags: string[];
  opportunityName: string;
} {
  const tags: string[] = ['Website Lead', 'Redbot Portal'];

  // Agregar tag según tipo de consulta
  if (form.inquiryType && INQUIRY_TYPE_TAGS[form.inquiryType]) {
    tags.push(INQUIRY_TYPE_TAGS[form.inquiryType]);
  }

  const contact: Omit<GHLContact, 'id'> = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone || undefined,
    source: 'Redbot Portal - Contacto',
    tags,
  };

  const opportunityName = `Lead Web: ${form.firstName} ${form.lastName}`;

  return { contact, tags, opportunityName };
}

/**
 * Mapea datos del formulario de propiedad a contacto GHL
 */
export function mapPropertyFormToGHL(form: PropertyContactFormData): {
  firstName: string;
  lastName: string;
  contact: Omit<GHLContact, 'id'>;
  tags: string[];
  opportunityName: string;
} {
  // Separar nombre completo en firstName y lastName
  const nameParts = form.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Sin';
  const lastName = nameParts.slice(1).join(' ') || 'Nombre';

  const tags: string[] = ['Website Lead', 'Redbot Portal', 'Propiedad Específica'];

  // Agregar tag de la propiedad si existe
  if (form.propertyTitle) {
    // Crear un tag corto basado en el tipo de propiedad
    const propertyTag = `Propiedad: ${form.propertyTitle.substring(0, 30)}`;
    tags.push(propertyTag);
  }

  // Agregar tag del agente si existe
  if (form.agentName) {
    tags.push(`Agente: ${form.agentName}`);
  }

  const contact: Omit<GHLContact, 'id'> = {
    firstName,
    lastName,
    email: form.email,
    phone: form.phone || undefined,
    source: 'Redbot Portal - Propiedad',
    tags,
  };

  // Crear nombre de oportunidad descriptivo
  const opportunityName = form.propertyTitle
    ? `Lead: ${firstName} - ${form.propertyTitle.substring(0, 40)}`
    : `Lead Propiedad: ${firstName} ${lastName}`;

  return { firstName, lastName, contact, tags, opportunityName };
}

/**
 * Normaliza un número de teléfono colombiano
 * Asegura formato +57XXXXXXXXXX
 */
export function normalizeColombianPhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;

  // Eliminar espacios, guiones y paréntesis
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Si empieza con 0, quitarlo
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Si no tiene código de país, agregar +57
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('57')) {
      cleaned = '+' + cleaned;
    } else {
      cleaned = '+57' + cleaned;
    }
  }

  return cleaned;
}

/**
 * Valida que los datos del formulario estén completos
 */
export function validateContactForm(data: Partial<ContactFormData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.firstName?.trim()) {
    errors.push('El nombre es requerido');
  }
  if (!data.lastName?.trim()) {
    errors.push('El apellido es requerido');
  }
  if (!data.email?.trim()) {
    errors.push('El email es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('El email no es válido');
  }
  if (!data.message?.trim()) {
    errors.push('El mensaje es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida que los datos del formulario de propiedad estén completos
 */
export function validatePropertyForm(data: Partial<PropertyContactFormData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.fullName?.trim()) {
    errors.push('El nombre es requerido');
  }
  if (!data.email?.trim()) {
    errors.push('El email es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('El email no es válido');
  }
  if (!data.message?.trim()) {
    errors.push('El mensaje es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
