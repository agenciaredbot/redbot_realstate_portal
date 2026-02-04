/**
 * Script para probar la sincronización Airtable → Supabase
 * Ejecutar con: npx tsx scripts/test-sync.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import Airtable from 'airtable';

// Configure Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing Airtable credentials');
  console.log('  AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('  AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const airtableBase = Airtable.base(AIRTABLE_BASE_ID);

// Configure Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Table names
const AIRTABLE_TABLES = {
  PROPERTIES: 'Properties',
  AGENTS: 'Agents',
};

// Helper to get all records
async function getAllRecords<T>(tableName: string): Promise<Array<{ id: string; fields: T }>> {
  const records: Array<{ id: string; fields: T }> = [];

  await airtableBase(tableName)
    .select({})
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

// Generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Map transaction type to status enum
function mapPropertyStatus(transactionType?: string): 'venta' | 'arriendo' | 'venta_arriendo' {
  if (!transactionType) return 'venta';
  const typeLower = transactionType.toLowerCase();
  if (typeLower.includes('arriendo') && typeLower.includes('venta')) return 'venta_arriendo';
  if (typeLower.includes('arriendo') || typeLower.includes('renta')) return 'arriendo';
  return 'venta';
}

// Map property type
function mapPropertyType(type?: string): string {
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

// Map amenities
function mapAmenities(amenities?: string[]): string[] {
  if (!amenities) return [];
  return amenities.map((a) =>
    a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
  );
}

// Collect images
function collectImages(fields: any): string[] {
  const images: string[] = [];
  if (fields.Photo_Main && !fields.Photo_Main.includes('[Requiere')) images.push(fields.Photo_Main);
  if (fields.photo_extra1 && !fields.photo_extra1.includes('[Requiere')) images.push(fields.photo_extra1);
  if (fields.photo_extra2 && !fields.photo_extra2.includes('[Requiere')) images.push(fields.photo_extra2);
  if (fields.photo_extra3 && !fields.photo_extra3.includes('[Requiere')) images.push(fields.photo_extra3);
  return images;
}

async function syncAgents() {
  console.log('\n📋 Sincronizando Agentes...');
  console.log('='.repeat(50));

  try {
    const airtableAgents = await getAllRecords<any>(AIRTABLE_TABLES.AGENTS);
    console.log(`   Encontrados ${airtableAgents.length} agentes en Airtable`);

    let created = 0, updated = 0, errors = 0;

    for (const record of airtableAgents) {
      const fields = record.fields;
      const fullName = fields.Full_Name || 'Sin Nombre';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || 'Sin';
      const lastName = nameParts.slice(1).join(' ') || 'Nombre';
      const slug = generateSlug(fullName) + '-' + record.id.slice(-6);

      const agentData = {
        slug,
        first_name: firstName,
        last_name: lastName,
        email: fields.Email || `${slug}@placeholder.com`,
        phone: fields.Phone ? String(fields.Phone) : null,
        bio: null,
        photo_url: fields.Photo && !fields.Photo.includes('[Requiere') ? fields.Photo : null,
        role: 'Agente Inmobiliario',
        license_number: null,
        years_experience: 0,
        specialties: fields.Specialization || [],
        languages: ['Español'],
        social_links: fields.WhatsApp ? { whatsapp: `https://wa.me/${fields.WhatsApp}` } : {},
        is_active: fields.Active ?? true,
      };

      try {
        const { data: existing } = await supabase
          .from('agents')
          .select('id')
          .eq('email', agentData.email)
          .single();

        if (existing) {
          const { error } = await supabase.from('agents').update(agentData).eq('id', existing.id);
          if (error) throw error;
          updated++;
          console.log(`   ✏️  Actualizado: ${fullName}`);
        } else {
          const { error } = await supabase.from('agents').insert(agentData);
          if (error) throw error;
          created++;
          console.log(`   ✅ Creado: ${fullName}`);
        }
      } catch (error: any) {
        errors++;
        console.log(`   ❌ Error con ${fullName}: ${error.message}`);
      }
    }

    console.log(`\n   Resumen: ${created} creados, ${updated} actualizados, ${errors} errores`);
    return true;
  } catch (error: any) {
    console.error('   ❌ Error general:', error.message);
    return false;
  }
}

async function syncProperties() {
  console.log('\n📋 Sincronizando Propiedades...');
  console.log('='.repeat(50));

  try {
    const airtableProperties = await getAllRecords<any>(AIRTABLE_TABLES.PROPERTIES);
    console.log(`   Encontradas ${airtableProperties.length} propiedades en Airtable`);

    let created = 0, updated = 0, errors = 0;

    for (const record of airtableProperties) {
      const fields = record.fields;
      const title = fields.Title || 'Sin título';
      const slug = generateSlug(title) + '-' + record.id.slice(-6);

      const propertyData = {
        airtable_id: record.id,
        slug,
        title,
        description_short: fields.Description_Short || null,
        description: fields.Description_Full || null,
        status: mapPropertyStatus(fields.Transaction_Type),
        property_type: mapPropertyType(fields.Property_Type),
        is_featured: fields.Featured ?? false,
        is_active: fields.Status?.toLowerCase() === 'disponible',
        price: fields.Price || 0,
        price_currency: 'COP',
        admin_fee: fields.Maintenance_Fee || fields.HOA_Fee || null,
        address: fields.Address || null,
        city: fields.City || 'Bogotá',
        neighborhood: fields.Neighborhood || null,
        latitude: fields.Latitude || null,
        longitude: fields.Longitude || null,
        bedrooms: fields.Bedrooms || 0,
        bathrooms: Math.ceil((fields.Bathrooms || 0) + (fields.Half_Bathrooms || 0) * 0.5),
        parking_spots: fields.Parking_Spaces || 0,
        area_m2: fields.Square_Meters || null,
        area_built_m2: null,
        year_built: fields.Year_Built || null,
        stratum: null,
        floor_number: fields.Floor_Number ? Math.floor(parseFloat(fields.Floor_Number)) || null : null,
        total_floors: fields.Total_Floors || null,
        images: collectImages(fields),
        video_url: fields.Video_URL || fields.Drone_Video_URL || null,
        virtual_tour_url: fields.Virtual_Tour_URL || null,
        amenities: mapAmenities(fields.Amenities),
        agent_id: null,
      };

      try {
        const { data: existing } = await supabase
          .from('properties')
          .select('id')
          .eq('airtable_id', record.id)
          .single();

        if (existing) {
          const { error } = await supabase.from('properties').update(propertyData).eq('id', existing.id);
          if (error) throw error;
          updated++;
          console.log(`   ✏️  Actualizado: ${title}`);
        } else {
          const { error } = await supabase.from('properties').insert(propertyData);
          if (error) throw error;
          created++;
          console.log(`   ✅ Creado: ${title}`);
        }
      } catch (error: any) {
        errors++;
        console.log(`   ❌ Error con ${title}: ${error.message}`);
        console.log(`      Debug - floor_number raw: ${fields.Floor_Number}`);
      }
    }

    console.log(`\n   Resumen: ${created} creados, ${updated} actualizados, ${errors} errores`);
    return true;
  } catch (error: any) {
    console.error('   ❌ Error general:', error.message);
    return false;
  }
}

async function verifyData() {
  console.log('\n📊 Verificando datos en Supabase...');
  console.log('='.repeat(50));

  const { count: agentsCount } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true });

  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  console.log(`   Agentes en Supabase: ${agentsCount}`);
  console.log(`   Propiedades en Supabase: ${propertiesCount}`);

  const { data: sampleProperty } = await supabase
    .from('properties')
    .select('title, city, price, bedrooms, bathrooms, images')
    .limit(1)
    .single();

  if (sampleProperty) {
    console.log('\n   📝 Muestra de propiedad:');
    console.log(`      Título: ${sampleProperty.title}`);
    console.log(`      Ciudad: ${sampleProperty.city}`);
    console.log(`      Precio: $${sampleProperty.price?.toLocaleString()}`);
    console.log(`      Habitaciones: ${sampleProperty.bedrooms}`);
    console.log(`      Baños: ${sampleProperty.bathrooms}`);
    console.log(`      Imágenes: ${sampleProperty.images?.length || 0}`);
  }
}

async function main() {
  console.log('\n🚀 Iniciando sincronización Airtable → Supabase');
  console.log('='.repeat(60));

  const agentsSuccess = await syncAgents();
  if (!agentsSuccess) {
    console.log('\n⚠️  Hubo errores sincronizando agentes, continuando...');
  }

  const propertiesSuccess = await syncProperties();
  if (!propertiesSuccess) {
    console.log('\n⚠️  Hubo errores sincronizando propiedades');
  }

  await verifyData();

  console.log('\n' + '='.repeat(60));
  console.log('✅ Sincronización completada!');
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
