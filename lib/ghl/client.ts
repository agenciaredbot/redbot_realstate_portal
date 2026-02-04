/**
 * GoHighLevel API v2 Client
 *
 * Cliente para interactuar con la API de GoHighLevel usando OAuth 2.0
 * Documentación: https://highlevel.stoplight.io/docs/integrations
 */

const GHL_API_URL = 'https://services.leadconnectorhq.com';

// Types
export interface GHLContact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  tags?: string[];
  customFields?: { id: string; value: string }[];
  locationId?: string;
}

export interface GHLOpportunity {
  id?: string;
  name: string;
  status: 'open' | 'won' | 'lost' | 'abandoned';
  pipelineId: string;
  pipelineStageId: string;
  contactId: string;
  monetaryValue?: number;
  source?: string;
}

export interface GHLPipelineStage {
  id: string;
  name: string;
  position: number;
}

export interface GHLPipeline {
  id: string;
  name: string;
  stages: GHLPipelineStage[];
}

// Cache para el Stage ID de "Nuevo Lead"
let cachedNuevoLeadStageId: string | null = null;

/**
 * Obtiene los headers necesarios para las peticiones a GHL API v2
 */
function getHeaders(): HeadersInit {
  const token = process.env.GHL_ACCESS_TOKEN;
  if (!token) {
    throw new Error('GHL_ACCESS_TOKEN no está configurado');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28',
  };
}

/**
 * Obtiene el Location ID configurado
 */
function getLocationId(): string {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) {
    throw new Error('GHL_LOCATION_ID no está configurado');
  }
  return locationId;
}

/**
 * Obtiene el Pipeline ID configurado
 */
function getPipelineId(): string {
  const pipelineId = process.env.GHL_PIPELINE_ID;
  if (!pipelineId) {
    throw new Error('GHL_PIPELINE_ID no está configurado');
  }
  return pipelineId;
}

/**
 * Obtiene los stages de un pipeline
 */
export async function getPipelineStages(pipelineId?: string): Promise<GHLPipelineStage[]> {
  const id = pipelineId || getPipelineId();

  // La API v2 usa /opportunities/pipelines (plural) con locationId
  const params = new URLSearchParams({
    locationId: getLocationId(),
  });

  const response = await fetch(`${GHL_API_URL}/opportunities/pipelines?${params}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('GHL Get Pipelines Error:', error);
    throw new Error(`GHL Pipeline Error: ${response.status}`);
  }

  const data = await response.json();

  // Buscar el pipeline específico por ID
  const pipeline = data.pipelines?.find((p: { id: string }) => p.id === id);

  if (!pipeline) {
    console.error('Pipeline no encontrado:', id);
    throw new Error(`Pipeline ${id} no encontrado`);
  }

  return pipeline.stages || [];
}

/**
 * Obtiene el Stage ID de "Nuevo Lead" (con cache)
 */
export async function getNuevoLeadStageId(): Promise<string> {
  // Retornar de cache si existe
  if (cachedNuevoLeadStageId) {
    return cachedNuevoLeadStageId;
  }

  // Buscar en los stages del pipeline
  const stages = await getPipelineStages();
  const nuevoLeadStage = stages.find(
    (stage) => stage.name.toLowerCase().includes('nuevo lead') ||
               stage.name.toLowerCase().includes('new lead') ||
               stage.name.toLowerCase() === 'nuevo'
  );

  if (!nuevoLeadStage) {
    // Si no encuentra "Nuevo Lead", usar el primer stage
    if (stages.length > 0) {
      console.warn('Stage "Nuevo Lead" no encontrado, usando primer stage:', stages[0].name);
      cachedNuevoLeadStageId = stages[0].id;
      return stages[0].id;
    }
    throw new Error('No se encontraron stages en el pipeline');
  }

  cachedNuevoLeadStageId = nuevoLeadStage.id;
  return nuevoLeadStage.id;
}

/**
 * Crea un nuevo contacto en GoHighLevel
 * Si el contacto ya existe (duplicado), retorna el contacto existente
 */
export async function createContact(contact: Omit<GHLContact, 'id'>): Promise<GHLContact> {
  const response = await fetch(`${GHL_API_URL}/contacts/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      ...contact,
      locationId: getLocationId(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('GHL Create Contact Error:', errorText);

    // Manejar caso de contacto duplicado
    if (response.status === 400) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message?.includes('duplicated') && errorData.meta?.contactId) {
          // Retornar el contacto existente
          console.log('Contacto duplicado detectado, usando existente:', errorData.meta.contactId);
          return {
            id: errorData.meta.contactId,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
          };
        }
      } catch {
        // Si no se puede parsear, continuar con el error original
      }
    }

    throw new Error(`GHL Contact Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.contact;
}

/**
 * Busca un contacto por email usando el endpoint correcto de API v2
 * Nota: La API de GHL no permite filtrar directamente por email en el GET,
 * así que simplemente intentamos crear y manejamos el duplicado
 */
export async function findContactByEmail(email: string): Promise<GHLContact | null> {
  // Por ahora, retornamos null y dejamos que createContact maneje los duplicados
  // La API de GHL no tiene un endpoint simple para buscar por email
  console.log('findContactByEmail: Skipping search, will handle duplicate on create');
  return null;
}

/**
 * Crea una nueva oportunidad en GoHighLevel
 */
export async function createOpportunity(opportunity: Omit<GHLOpportunity, 'id'>): Promise<GHLOpportunity> {
  const response = await fetch(`${GHL_API_URL}/opportunities/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      ...opportunity,
      locationId: getLocationId(), // Agregar locationId requerido
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('GHL Create Opportunity Error:', error);
    throw new Error(`GHL Opportunity Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.opportunity;
}

/**
 * Crea un lead completo (contacto + oportunidad)
 * Esta es la función principal que usarán los formularios
 */
export async function createLead(params: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  tags?: string[];
  opportunityName?: string;
  source?: string;
}): Promise<{ contact: GHLContact; opportunity: GHLOpportunity }> {
  const { firstName, lastName, email, phone, message, tags = [], opportunityName, source = 'Redbot Portal' } = params;

  // 1. Buscar si el contacto ya existe
  let contact = await findContactByEmail(email);

  // 2. Si no existe, crear nuevo contacto
  if (!contact) {
    contact = await createContact({
      firstName,
      lastName,
      email,
      phone,
      source,
      tags: ['Website Lead', 'Redbot Portal', ...tags],
    });
  }

  // 3. Obtener el Stage ID de "Nuevo Lead"
  const stageId = await getNuevoLeadStageId();

  // 4. Crear oportunidad
  const opportunity = await createOpportunity({
    name: opportunityName || `Lead Web: ${firstName} ${lastName}`,
    status: 'open',
    pipelineId: getPipelineId(),
    pipelineStageId: stageId,
    contactId: contact.id!,
    source,
  });

  return { contact, opportunity };
}

/**
 * Actualiza tags de un contacto existente
 */
export async function updateContactTags(contactId: string, tags: string[]): Promise<void> {
  const response = await fetch(`${GHL_API_URL}/contacts/${contactId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ tags }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('GHL Update Contact Tags Error:', error);
    throw new Error(`GHL Update Tags Error: ${response.status}`);
  }
}
