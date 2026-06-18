/**
 * IETE Student Forum – KEC
 * Supabase Client Initialization
 * Uses Supabase JS v2 via CDN (loaded in each HTML page)
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client (requires supabase-js CDN script in HTML)
const { createClient } = window.supabase;

if (!SUPABASE_URL || SUPABASE_URL === 'https://YOUR_PROJECT_ID.supabase.co') {
  console.warn(
    '⚠️ IETE Website: Supabase credentials not configured.\n' +
    'Edit assets/js/config.js with your Project URL and Anon Key.\n' +
    'See SUPABASE_SETUP.md for step-by-step instructions.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Generic fetch helper — returns { data, error }
 * @param {string} table  - Supabase table name
 * @param {object} opts   - { select, filter, order, limit, single }
 */
export async function fetchRecords(table, opts = {}) {
  let query = supabase.from(table).select(opts.select || 'id');
  if (opts.filter) {
    for (const [col, val] of Object.entries(opts.filter)) {
      query = query.eq(col, val);
    }
  }
  if (opts.order) {
    query = query.order(opts.order.col, { ascending: opts.order.asc ?? false });
  }
  if (opts.limit) query = query.limit(opts.limit);
  if (opts.single) query = query.single();
  const { data, error } = await query;
  return { data, error };
}

/**
 * Upload an image file to Supabase Storage
 * @param {string} bucket  - bucket name from STORAGE_BUCKETS
 * @param {string} path    - file path within the bucket (e.g. 'team/avatar.jpg')
 * @param {File}   file    - File object
 * @returns {Promise<string|null>} - public URL or null on error
 */
export async function uploadImage(bucket, path, file) {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket
 * @param {string} path
 */
export async function deleteImage(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error('Delete error:', error);
  return !error;
}

/**
 * Get public URL for a stored file
 */
export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export default supabase;
