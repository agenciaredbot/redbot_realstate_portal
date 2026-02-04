/**
 * GoHighLevel Integration
 *
 * Exporta todas las funciones y tipos necesarios para integrar con GHL
 */

export {
  // Client functions
  createContact,
  createOpportunity,
  createLead,
  findContactByEmail,
  getPipelineStages,
  getNuevoLeadStageId,
  updateContactTags,
  // Types
  type GHLContact,
  type GHLOpportunity,
  type GHLPipeline,
  type GHLPipelineStage,
} from './client';

export {
  // Mappers
  mapContactFormToGHL,
  mapPropertyFormToGHL,
  normalizeColombianPhone,
  validateContactForm,
  validatePropertyForm,
  // Types
  type ContactFormData,
  type PropertyContactFormData,
} from './mappers';
