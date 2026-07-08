/**
 * Supabase client singleton.
 * Initializes and exports the Supabase client using environment variables.
 *
 * Environment variables (set in .env):
 *   VITE_SUPABASE_URL      - Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY - Your Supabase anon/public key
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Missing Supabase environment variables. ' +
        'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
}

/**
 * The shared Supabase client instance.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
