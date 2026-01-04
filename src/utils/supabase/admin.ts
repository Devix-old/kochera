import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Server-only Supabase client for public data (no cookies, no auth)
 * Use this for public read operations like fetching approved comments.
 * 
 * This client:
 * - Does NOT use cookies
 * - Does NOT require authentication
 * - Does NOT persist sessions
 * - Is faster and cache-safe
 * - Perfect for public comment APIs
 */
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

