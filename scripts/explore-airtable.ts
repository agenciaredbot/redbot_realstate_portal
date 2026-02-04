/**
 * Script para explorar la estructura de Airtable
 * Ejecutar con: npx tsx scripts/explore-airtable.ts
 */

import Airtable from 'airtable';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing Airtable credentials');
  console.log('  AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('  AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function exploreTable(tableName: string) {
  console.log(`\n📋 Explorando tabla: "${tableName}"`);
  console.log('='.repeat(50));

  try {
    const records = await base(tableName)
      .select({ maxRecords: 3 })
      .firstPage();

    if (records.length === 0) {
      console.log('   (tabla vacía o no existe)');
      return null;
    }

    console.log(`   ✅ Encontrados ${records.length} registros de muestra`);
    console.log('\n   📝 Campos encontrados:');

    // Get all unique field names from the records
    const allFields = new Set<string>();
    records.forEach((record) => {
      Object.keys(record.fields).forEach((field) => allFields.add(field));
    });

    const fieldsList = Array.from(allFields).sort();
    fieldsList.forEach((field) => {
      const sampleValue = records.find((r) => r.fields[field] !== undefined)?.fields[field];
      const valueType = Array.isArray(sampleValue)
        ? `array[${sampleValue.length}]`
        : typeof sampleValue;
      const preview =
        typeof sampleValue === 'string'
          ? `"${sampleValue.slice(0, 30)}${sampleValue.length > 30 ? '...' : ''}"`
          : Array.isArray(sampleValue)
          ? `[${sampleValue.slice(0, 2).join(', ')}${sampleValue.length > 2 ? '...' : ''}]`
          : String(sampleValue);

      console.log(`      - ${field}: ${valueType} → ${preview}`);
    });

    return { tableName, fields: fieldsList, sampleRecord: records[0]?.fields };
  } catch (error: any) {
    if (error.statusCode === 404 || error.message?.includes('Could not find table')) {
      console.log(`   ❌ Tabla "${tableName}" no encontrada`);
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
    return null;
  }
}

async function main() {
  console.log('\n🔍 Explorando Airtable Base:', AIRTABLE_BASE_ID);
  console.log('='.repeat(60));

  // Try common table names
  const possibleTableNames = [
    // Spanish
    'Propiedades',
    'Agentes',
    'Inventario',
    'Inmuebles',
    'Equipo',
    // English
    'Properties',
    'Agents',
    'Listings',
    'Team',
    'Real Estate',
    // Other common names
    'Inmobiliaria',
    'Catalogo',
    'Portafolio',
  ];

  const foundTables: string[] = [];

  for (const tableName of possibleTableNames) {
    const result = await exploreTable(tableName);
    if (result) {
      foundTables.push(tableName);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));

  if (foundTables.length > 0) {
    console.log('\n✅ Tablas encontradas:');
    foundTables.forEach((t) => console.log(`   - ${t}`));
    console.log('\n📝 Próximo paso:');
    console.log('   Actualiza los nombres de tabla en lib/airtable/client.ts');
    console.log('   y ajusta los nombres de campos en lib/airtable/mappers.ts');
  } else {
    console.log('\n⚠️  No se encontraron tablas con los nombres comunes.');
    console.log('   Por favor, indica los nombres exactos de tus tablas en Airtable.');
  }

  console.log('\n');
}

main().catch(console.error);
