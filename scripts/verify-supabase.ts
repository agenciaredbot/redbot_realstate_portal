/**
 * Script para verificar la conexión con Supabase
 * Ejecutar con: npx tsx scripts/verify-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('\n🔍 Verificando conexión con Supabase...\n');
  console.log(`URL: ${supabaseUrl}\n`);

  // Test 1: Check if we can connect
  console.log('1. Probando conexión básica...');
  try {
    const { error } = await supabase.from('site_settings').select('key').limit(1);
    if (error) {
      // If table doesn't exist, that's expected before running migrations
      if (error.code === '42P01') {
        console.log('   ⚠️  Conexión exitosa, pero las tablas no existen aún.');
        console.log('   📝 Ejecuta el script SQL en Supabase Dashboard → SQL Editor');
        return false;
      }
      throw error;
    }
    console.log('   ✅ Conexión exitosa!\n');
  } catch (err) {
    console.error('   ❌ Error de conexión:', err);
    return false;
  }

  // Test 2: Check tables exist
  console.log('2. Verificando tablas...');
  const tables = ['agents', 'properties', 'contact_submissions', 'testimonials', 'blog_posts', 'projects', 'site_settings'];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === '42P01') {
          console.log(`   ❌ Tabla '${table}' no existe`);
        } else {
          console.log(`   ⚠️  Tabla '${table}': ${error.message}`);
        }
      } else {
        console.log(`   ✅ Tabla '${table}' existe`);
      }
    } catch (err) {
      console.log(`   ❌ Error verificando '${table}':`, err);
    }
  }

  // Test 3: Check site_settings content
  console.log('\n3. Verificando datos iniciales (site_settings)...');
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) throw error;

    if (data && data.length > 0) {
      console.log(`   ✅ ${data.length} configuraciones encontradas:`);
      data.forEach((setting) => {
        console.log(`      - ${setting.key}`);
      });
    } else {
      console.log('   ⚠️  No hay configuraciones. El INSERT inicial no se ejecutó.');
    }
  } catch (err) {
    console.log('   ❌ Error:', err);
  }

  console.log('\n✅ Verificación completada!\n');
  return true;
}

verifyConnection().then((success) => {
  if (!success) {
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Ve a: https://supabase.com/dashboard/project/' + supabaseUrl?.split('//')[1]?.split('.')[0] + '/sql/new');
    console.log('2. Copia y pega el contenido de: supabase/migrations/001_initial_schema.sql');
    console.log('3. Haz clic en "Run"');
    console.log('4. Vuelve a ejecutar este script para verificar\n');
  }
  process.exit(success ? 0 : 1);
});
