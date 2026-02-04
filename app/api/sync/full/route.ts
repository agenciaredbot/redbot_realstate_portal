import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Full sync: Agents first, then Properties
 * POST /api/sync/full
 */
export async function POST(request: Request) {
  try {
    // Optional: Add API key protection
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SYNC_API_KEY;

    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (expectedKey) {
      headers['Authorization'] = `Bearer ${expectedKey}`;
    }

    console.log('Starting full sync from Airtable...');

    // Step 1: Sync Agents first (properties may reference them)
    console.log('Step 1: Syncing agents...');
    const agentsResponse = await fetch(`${baseUrl}/api/sync/agents`, {
      method: 'POST',
      headers,
    });
    const agentsResult = await agentsResponse.json();

    if (!agentsResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to sync agents',
        details: agentsResult,
      }, { status: 500 });
    }

    // Step 2: Sync Properties
    console.log('Step 2: Syncing properties...');
    const propertiesResponse = await fetch(`${baseUrl}/api/sync/properties`, {
      method: 'POST',
      headers,
    });
    const propertiesResult = await propertiesResponse.json();

    if (!propertiesResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to sync properties',
        details: propertiesResult,
      }, { status: 500 });
    }

    console.log('Full sync completed!');

    return NextResponse.json({
      success: true,
      message: 'Full sync completed',
      results: {
        agents: agentsResult.results,
        properties: propertiesResult.results,
      },
    });
  } catch (error) {
    console.error('Error in full sync:', error);
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
    endpoint: '/api/sync/full',
    method: 'POST',
    description: 'Full sync: Agents + Properties from Airtable to Supabase',
    status: 'ready',
    order: [
      '1. Sync agents from Airtable',
      '2. Sync properties from Airtable',
    ],
  });
}
