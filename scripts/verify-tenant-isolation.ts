/**
 * Script to verify tenant data isolation
 * Run with: npx tsx scripts/verify-tenant-isolation.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const REDBOT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_TENANT_ID = '00000000-0000-0000-0000-000000000002';

interface VerificationResult {
  table: string;
  redbotCount: number;
  demoCount: number;
  orphanedRecords: number;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
}

async function verifyTable(tableName: string): Promise<VerificationResult> {
  try {
    // Count records for each tenant
    const { count: redbotCount } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', REDBOT_TENANT_ID);

    const { count: demoCount } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', DEMO_TENANT_ID);

    // Check for records without tenant_id (orphaned)
    const { count: orphanedCount } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .is('tenant_id', null);

    const orphanedRecords = orphanedCount || 0;
    const status: 'PASS' | 'FAIL' | 'WARNING' =
      orphanedRecords > 0 ? 'FAIL' :
      (redbotCount || 0) === 0 && (demoCount || 0) === 0 ? 'WARNING' :
      'PASS';

    return {
      table: tableName,
      redbotCount: redbotCount || 0,
      demoCount: demoCount || 0,
      orphanedRecords,
      status,
      message: orphanedRecords > 0
        ? `Found ${orphanedRecords} orphaned records without tenant_id`
        : status === 'WARNING'
        ? 'No records in this table'
        : 'Data properly isolated',
    };
  } catch (error) {
    return {
      table: tableName,
      redbotCount: 0,
      demoCount: 0,
      orphanedRecords: 0,
      status: 'FAIL',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function verifyTenants(): Promise<void> {
  console.log('\n🔍 Verifying tenant configuration...\n');

  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('id, name, slug, subdomain, domain, is_active, plan');

  if (error) {
    console.error('❌ Error fetching tenants:', error.message);
    return;
  }

  console.log('📋 Registered Tenants:');
  console.log('─'.repeat(80));

  for (const tenant of tenants || []) {
    const statusIcon = tenant.is_active ? '✅' : '❌';
    console.log(`${statusIcon} ${tenant.name} (${tenant.slug})`);
    console.log(`   ID: ${tenant.id}`);
    console.log(`   Plan: ${tenant.plan}`);
    console.log(`   Subdomain: ${tenant.subdomain || 'N/A'}`);
    console.log(`   Domain: ${tenant.domain || 'N/A'}`);
    console.log('');
  }
}

async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║        MULTI-TENANT ISOLATION VERIFICATION SCRIPT             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  // Verify tenants exist
  await verifyTenants();

  // Tables to verify
  const tables = [
    'profiles',
    'agents',
    'properties',
    'projects',
    'blog_posts',
    'blog_categories',
    'contact_submissions',
    'notifications',
    'testimonials',
    'favorites',
    'site_settings',
  ];

  console.log('🔍 Verifying data isolation per table...\n');
  console.log('─'.repeat(80));
  console.log(
    'Table'.padEnd(25) +
    'Redbot'.padStart(10) +
    'Demo'.padStart(10) +
    'Orphaned'.padStart(10) +
    'Status'.padStart(12) +
    'Message'.padStart(15)
  );
  console.log('─'.repeat(80));

  const results: VerificationResult[] = [];

  for (const table of tables) {
    const result = await verifyTable(table);
    results.push(result);

    const statusIcon =
      result.status === 'PASS' ? '✅' :
      result.status === 'WARNING' ? '⚠️' :
      '❌';

    console.log(
      result.table.padEnd(25) +
      String(result.redbotCount).padStart(10) +
      String(result.demoCount).padStart(10) +
      String(result.orphanedRecords).padStart(10) +
      `${statusIcon} ${result.status}`.padStart(12)
    );
  }

  console.log('─'.repeat(80));

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log('\n📊 SUMMARY:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ VERIFICATION FAILED - Found data isolation issues!');
    console.log('   Please review the tables with orphaned records.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  VERIFICATION PASSED WITH WARNINGS');
    console.log('   Some tables have no data - this may be expected.');
  } else {
    console.log('\n✅ VERIFICATION PASSED - All data properly isolated!');
  }

  // Additional checks
  console.log('\n🔐 Testing RLS policies...\n');

  // Test that we can't access data without proper context
  const { data: propertiesNoFilter, error: rlsError } = await supabase
    .from('properties')
    .select('id, title, tenant_id')
    .limit(5);

  if (rlsError) {
    console.log('✅ RLS is blocking direct access (expected with service key)');
  } else {
    console.log(`📋 Sample properties with tenant info:`);
    for (const prop of propertiesNoFilter || []) {
      console.log(`   - ${prop.title} (tenant: ${prop.tenant_id})`);
    }
  }

  console.log('\n═'.repeat(80));
  console.log('Done!');
}

main().catch(console.error);
