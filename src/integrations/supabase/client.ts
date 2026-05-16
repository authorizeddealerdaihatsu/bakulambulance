// Supabase Client (Mandiri)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

let _initError: string | null = null;
let _supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

function getClient() {
  if (_supabaseClient) return _supabaseClient;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    _initError = `Missing env variable(s): ${[
      !SUPABASE_URL && 'VITE_SUPABASE_URL',
      !SUPABASE_PUBLISHABLE_KEY && 'VITE_SUPABASE_PUBLISHABLE_KEY',
    ].filter(Boolean).join(', ')}. Pastikan sudah diatur di file .env`;
    console.error('[Supabase]', _initError);
    // Kembalikan dummy client agar komponen tidak crash
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
    );
  }
  _supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return _supabaseClient;
}

/** Kembalikan error konfigurasi jika env variable tidak diset */
export function getSupabaseConfigError() {
  // Trigger inisialisasi agar _initError terisi
  getClient();
  return _initError;
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
