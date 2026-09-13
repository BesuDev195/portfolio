import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// This client does not read cookies and does not have user authentication context.
// It is safe to use in server components to fetch public data without triggering Dynamic Rendering.
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
