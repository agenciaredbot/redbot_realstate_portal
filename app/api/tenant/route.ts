// =====================================================
// API: Get Current Tenant
// Returns tenant based on request hostname
// =====================================================

import { NextResponse } from 'next/server';
import {
  getTenantFromRequest,
  TenantNotFoundError,
  TenantInactiveError,
} from '@/lib/supabase/tenant';

export async function GET() {
  try {
    const tenant = await getTenantFromRequest();

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error('Error getting tenant:', error);

    if (error instanceof TenantNotFoundError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    if (error instanceof TenantInactiveError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tenant is inactive',
          code: 'TENANT_INACTIVE',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get tenant',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
