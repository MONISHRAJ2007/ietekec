/**
 * IETE Student Forum – KEC
 * Authentication Helpers
 */

import supabase from './supabase-client.js';

/**
 * Require authentication — redirects to admin login if not authenticated.
 * Call this at the top of every admin page script.
 */
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/admin/login.html';
    return null;
  }
  return session;
}

/**
 * Get current session without redirecting
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Login with email + password
 * @param {string} email
 * @param {string} password
 * @returns {{ user, error }}
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user, error };
}

/**
 * Logout current session
 */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/admin/login.html';
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Populate the admin user display in sidebar
 */
export async function populateAdminUser() {
  const user = await getCurrentUser();
  if (!user) return;

  const nameEl = document.getElementById('admin-user-name');
  const roleEl = document.getElementById('admin-user-role');
  const avatarEl = document.getElementById('admin-user-avatar');

  if (nameEl) nameEl.textContent = user.email?.split('@')[0] || 'Admin';
  if (roleEl) roleEl.textContent = 'Administrator';
  if (avatarEl) {
    const initial = (user.email || 'A')[0].toUpperCase();
    avatarEl.textContent = initial;
  }
}
