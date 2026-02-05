import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getAllRecords, AIRTABLE_TABLES, type AirtableAgentFields } from '@/lib/airtable/client';
import { mapAirtableAgentToSupabase } from '@/lib/airtable/mappers';

export const dynamic = 'force-dynamic';

/**
 * Sync agents from Airtable to Supabase
 * POST /api/sync/agents
 */
export async function POST(request: Request) {
  try {
    // Optional: Add API key protection
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SYNC_API_KEY;

    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting agents sync from Airtable...');

    // Get all agents from Airtable
    const airtableAgents = await getAllRecords<AirtableAgentFields>(
      AIRTABLE_TABLES.AGENTS
    );

    console.log(`Found ${airtableAgents.length} agents in Airtable`);

    const supabase = createAdminClient();
    const results = {
      total: airtableAgents.length,
      created: 0,
      updated: 0,
      errors: 0,
      details: [] as Array<{ id: string; name: string; action: string; error?: string }>,
    };

    for (const record of airtableAgents) {
      const agentData = mapAirtableAgentToSupabase(record.id, record.fields);
      const agentName = record.fields.Full_Name || 'Unknown Agent';

      try {
        // Check if agent already exists (by airtable_id first, fallback to email)
        let existingAgent = null;
        const { data: byAirtableId } = await supabase
          .from('agents')
          .select('id')
          .eq('airtable_id', record.id)
          .single();

        if (byAirtableId) {
          existingAgent = byAirtableId;
        } else {
          const { data: byEmail } = await supabase
            .from('agents')
            .select('id')
            .eq('email', agentData.email as string)
            .single();
          existingAgent = byEmail;
        }

        if (existingAgent) {
          // Update existing agent
          const { error: updateError } = await supabase
            .from('agents')
            .update(agentData)
            .eq('id', existingAgent.id);

          if (updateError) throw updateError;

          results.updated++;
          results.details.push({
            id: record.id,
            name: agentName,
            action: 'updated',
          });
        } else {
          // Insert new agent
          const { error: insertError } = await supabase
            .from('agents')
            .insert(agentData);

          if (insertError) throw insertError;

          results.created++;
          results.details.push({
            id: record.id,
            name: agentName,
            action: 'created',
          });
        }
      } catch (error) {
        console.error(`Error syncing agent ${record.id}:`, error);
        results.errors++;
        results.details.push({
          id: record.id,
          name: agentName,
          action: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('Agents sync completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Agents sync completed',
      results,
    });
  } catch (error) {
    console.error('Error in agents sync:', error);
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
    endpoint: '/api/sync/agents',
    method: 'POST',
    description: 'Sync agents from Airtable to Supabase',
    status: 'ready',
  });
}
