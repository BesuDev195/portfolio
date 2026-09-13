import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log(`Testing connection to: ${supabaseUrl}`);
  
  try {
    // Attempt to query the posts table
    const { data, error } = await supabase.from('blogs').select('id, title').limit(1);
    
    if (error) {
      console.error("❌ Error querying 'posts' table:", error.message);
      console.error("Details:", error);
    } else {
      console.log("✅ Successfully connected to Supabase!");
      console.log("Data from 'posts' table:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testConnection();
