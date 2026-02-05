import Airtable from 'airtable';

// Validate environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY) {
  console.warn('Warning: AIRTABLE_API_KEY is not set');
}

if (!AIRTABLE_BASE_ID) {
  console.warn('Warning: AIRTABLE_BASE_ID is not set');
}

// Configure Airtable
Airtable.configure({
  apiKey: AIRTABLE_API_KEY,
});

// Get the base
export const airtableBase = AIRTABLE_BASE_ID
  ? Airtable.base(AIRTABLE_BASE_ID)
  : null;

// Table names - matching your Airtable structure
export const AIRTABLE_TABLES = {
  PROPERTIES: 'Properties',
  AGENTS: 'Agents',
} as const;

// Helper function to get all records from a table
export async function getAllRecords<T>(
  tableName: string,
  options?: {
    view?: string;
    filterByFormula?: string;
    maxRecords?: number;
  }
): Promise<Array<{ id: string; fields: T }>> {
  if (!airtableBase) {
    throw new Error('Airtable base not configured');
  }

  const records: Array<{ id: string; fields: T }> = [];

  // Build select params, filtering out undefined values
  // Airtable SDK rejects undefined values for select params
  const selectParams: Record<string, unknown> = {};
  if (options?.view) selectParams.view = options.view;
  if (options?.filterByFormula) selectParams.filterByFormula = options.filterByFormula;
  if (options?.maxRecords) selectParams.maxRecords = options.maxRecords;

  await airtableBase(tableName)
    .select(selectParams)
    .eachPage((pageRecords, fetchNextPage) => {
      pageRecords.forEach((record) => {
        records.push({
          id: record.id,
          fields: record.fields as T,
        });
      });
      fetchNextPage();
    });

  return records;
}

// Helper function to get a single record by ID
export async function getRecordById<T>(
  tableName: string,
  recordId: string
): Promise<{ id: string; fields: T } | null> {
  if (!airtableBase) {
    throw new Error('Airtable base not configured');
  }

  try {
    const record = await airtableBase(tableName).find(recordId);
    return {
      id: record.id,
      fields: record.fields as T,
    };
  } catch (error) {
    console.error(`Error fetching record ${recordId} from ${tableName}:`, error);
    return null;
  }
}

// Types for Airtable records - MATCHING YOUR ACTUAL AIRTABLE SCHEMA
export interface AirtablePropertyFields {
  // Basic info
  Title?: string;
  Description_Short?: string;
  Description_Full?: string;
  property_ID?: string;

  // Status
  Status?: string; // Disponible, etc.
  Transaction_Type?: string; // Venta, Arriendo
  Property_Type?: string; // Apartamento, Casa, etc.
  Featured?: boolean;
  Exclusive_Listing?: boolean;

  // Pricing
  Price?: number;
  HOA_Fee?: number;
  Maintenance_Fee?: number;
  Commission_Percentage?: number;
  Property_Tax_Annual?: string;

  // Location
  Address?: string;
  City?: string;
  State?: string;
  Neighborhood?: string;
  ZIP_Code?: number;
  Latitude?: number;
  Longitude?: number;

  // Specs
  Bedrooms?: number;
  Bathrooms?: number;
  Half_Bathrooms?: number;
  Parking_Spaces?: number;
  Square_Meters?: number;
  Land_Size?: string;
  Year_Built?: number;
  Floor_Number?: string;
  Total_Floors?: number;
  Construction_Stage?: string;

  // Media
  Photo_Main?: string;
  photo_extra1?: string;
  photo_extra2?: string;
  photo_extra3?: string;
  Media_Gallery_Link?: string;
  Video_URL?: string;
  Drone_Video_URL?: string;
  Virtual_Tour_URL?: string;
  Floor_Plans?: string;
  Neighborhood_Photos?: string;

  // Features
  Amenities?: string[];
  Nearby_Services?: string[];
  Pet_Policy?: string;
  Furniture_Included?: string;
  Lease_Terms?: string;

  // Agent (linked record)
  Agent_Assigned?: string[];
  'Full_Name (from Agent_Assigned)'?: string[];

  // Other
  Owner_Contact?: string;
  Listing_Date?: string;
  Delivery_Date?: string;
  next_open_house_date?: string;
  Keywords_SEO?: string;
  Priority_Score?: number;

  // Stats
  Times_Viewed?: number;
  Times_Shared_WhatsApp?: number;
  Site_Visits_Scheduled?: number;
  Leads_Generated?: number;
}

export interface AirtableAgentFields {
  Full_Name?: string;
  Email?: string;
  Phone?: number;
  WhatsApp?: number;
  Photo?: string;
  Specialization?: string[];
  Active?: boolean;
  Agent_ID?: string;
  GHL_Contact_ID?: string;
  Properties_Sold?: number;
  properties?: string[]; // Linked records
}
