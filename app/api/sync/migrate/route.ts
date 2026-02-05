import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Run database migrations
 * POST /api/sync/migrate
 *
 * This endpoint adds the airtable_id column to agents table
 * so we can properly map Airtable agents to Supabase UUIDs
 * during property sync.
 */
export async function POST(request: Request) {
  try {
    // Optional: Add API key protection
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SYNC_API_KEY;

    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Check if airtable_id column already exists on agents
    const { data: testAgent } = await supabase
      .from('agents')
      .select('*')
      .limit(1);

    const hasAirtableId = testAgent && testAgent.length > 0 && 'airtable_id' in testAgent[0];

    if (hasAirtableId) {
      return NextResponse.json({
        success: true,
        message: 'Migration already applied - airtable_id column exists on agents',
      });
    }

    // We can't run DDL via PostgREST, so we'll use a workaround:
    // Create a temporary RPC function to run the ALTER TABLE
    // Actually, we need to do this via the Supabase SQL editor
    // For now, return instructions
    return NextResponse.json({
      success: false,
      message: 'Migration needs to be run manually via Supabase SQL Editor',
      sql: 'ALTER TABLE agents ADD COLUMN IF NOT EXISTS airtable_id VARCHAR(50) UNIQUE; CREATE INDEX IF NOT EXISTS idx_agents_airtable_id ON agents(airtable_id);',
      instructions: [
        '1. Go to https://supabase.com/dashboard/project/qyocxgypkypeswvfqgsp/sql/new',
        '2. Paste the SQL above',
        '3. Click "Run"',
        '4. Then call POST /api/sync/full to sync data',
      ],
    });
  } catch (error) {
    console.error('Error in migration:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
