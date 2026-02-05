import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Client for public/frontend use (respects RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
// Only use this in API routes, never expose to client
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to get storage URL for an image
export function getStorageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Helper to generate a unique file path for uploads
export function generateFilePath(folder: string, filename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = filename.split('.').pop();
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  return `${folder}/${timestamp}-${randomStr}-${safeName}`;
}

export default supabase;
