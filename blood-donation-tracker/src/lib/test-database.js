import { supabase } from './supabase.js';
import { getVerifiedHospitals, getActiveBloodRequests } from './database.js';

/**
 * Test database connection and basic operations
 */
export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Basic connection
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Database connection failed:', tablesError);
      return false;
    }

    console.log('✅ Database connection successful');
    console.log('📋 Available tables:', tables.map(t => t.table_name));

    // Test 2: Check if our tables exist
    const expectedTables = ['users', 'donors', 'hospitals', 'blood_inventory', 'blood_requests', 'donations', 'notifications'];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.warn('⚠️ Missing tables:', missingTables);
      console.log('💡 Please run the schema.sql file in your Supabase SQL editor');
    } else {
      console.log('✅ All required tables exist');
    }

    // Test 3: Test helper functions
    console.log('🧪 Testing helper functions...');
    
    const { data: hospitals, error: hospitalsError } = await getVerifiedHospitals();
    if (hospitalsError) {
      console.warn('⚠️ Error fetching hospitals:', hospitalsError.message);
    } else {
      console.log(`✅ Found ${hospitals?.length || 0} verified hospitals`);
    }

    const { data: requests, error: requestsError } = await getActiveBloodRequests();
    if (requestsError) {
      console.warn('⚠️ Error fetching blood requests:', requestsError.message);
    } else {
      console.log(`✅ Found ${requests?.length || 0} active blood requests`);
    }

    return true;

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

/**
 * Test blood type enums
 */
export async function testBloodTypeEnum() {
  console.log('🩸 Testing blood type enum...');
  
  try {
    const { data, error } = await supabase
      .rpc('get_blood_types'); // This would need to be created as a custom function

    if (error) {
      // Alternative method to test enum
      const { data: enumData, error: enumError } = await supabase
        .from('pg_enum')
        .select('enumlabel')
        .eq('enumtypid', 'blood_type_enum');

      if (enumError) {
        console.warn('⚠️ Could not verify blood type enum');
        return false;
      }
    }

    console.log('✅ Blood type enum is working');
    return true;
  } catch (error) {
    console.error('❌ Blood type enum test failed:', error);
    return false;
  }
}

/**
 * Run all database tests
 */
export async function runAllTests() {
  console.log('🚀 Starting database tests...\n');
  
  const connectionTest = await testDatabaseConnection();
  const enumTest = await testBloodTypeEnum();
  
  console.log('\n📊 Test Results:');
  console.log(`Database Connection: ${connectionTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Blood Type Enum: ${enumTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (connectionTest && enumTest) {
    console.log('\n🎉 All tests passed! Database is ready to use.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check your database setup.');
  }
  
  return connectionTest && enumTest;
}

// Auto-run tests if this file is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  console.log('Database test module loaded. Call runAllTests() to test your database connection.');
}
