import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getAllRecords, AIRTABLE_TABLES, type AirtablePropertyFields } from '@/lib/airtable/client';
import { mapAirtablePropertyToSupabase } from '@/lib/airtable/mappers';

export const dynamic = 'force-dynamic';

/**
 * Sync properties from Airtable to Supabase
 * POST /api/sync/properties
 */
export async function POST(request: Request) {
  try {
    // Optional: Add API key protection
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SYNC_API_KEY;

    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting properties sync from Airtable...');

    const supabase = createAdminClient();

    // First, get all agents to build the ID mapping
    const { data: agents } = await supabase
      .from('agents')
      .select('id, email');

    // Build a map of Airtable agent IDs to Supabase UUIDs
    // Note: This requires that agents have been synced first
    // For now, we'll skip agent linking if not available
    const agentIdMap = new Map<string, string>();
    // TODO: Implement proper Airtable ID to Supabase ID mapping
    // This would require storing the Airtable ID in the agents table

    // Get all properties from Airtable
    const airtableProperties = await getAllRecords<AirtablePropertyFields>(
      AIRTABLE_TABLES.PROPERTIES
    );

    console.log(`Found ${airtableProperties.length} properties in Airtable`);

    const results = {
      total: airtableProperties.length,
      created: 0,
      updated: 0,
      errors: 0,
      details: [] as Array<{ id: string; title: string; action: string; error?: string }>,
    };

    for (const record of airtableProperties) {
      const propertyData = mapAirtablePropertyToSupabase(
        record.id,
        record.fields,
        agentIdMap
      );
      const propertyTitle = record.fields.Title || 'Sin título';

      try {
        // Check if property already exists (by airtable_id)
        const { data: existingProperty } = await supabase
          .from('properties')
          .select('id')
          .eq('airtable_id', record.id)
          .single();

        if (existingProperty) {
          // Update existing property
          const { error: updateError } = await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', existingProperty.id);

          if (updateError) throw updateError;

          results.updated++;
          results.details.push({
            id: record.id,
            title: propertyTitle,
            action: 'updated',
          });
        } else {
          // Insert new property
          const { error: insertError } = await supabase
            .from('properties')
            .insert(propertyData);

          if (insertError) throw insertError;

          results.created++;
          results.details.push({
            id: record.id,
            title: propertyTitle,
            action: 'created',
          });
        }
      } catch (error) {
        console.error(`Error syncing property ${record.id}:`, error);
        results.errors++;
        results.details.push({
          id: record.id,
          title: propertyTitle,
          action: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('Properties sync completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Properties sync completed',
      results,
    });
  } catch (error) {
    console.error('Error in properties sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET method to check sync status
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/sync/properties',
    method: 'POST',
    description: 'Sync properties from Airtable to Supabase',
    status: 'ready',
  });
}
