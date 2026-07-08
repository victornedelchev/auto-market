/**
 * Auth Service.
 * Handles user authentication via Supabase Auth.
 * All functions return { data, error } following Supabase conventions.
 */
import { supabase } from './supabase.js';

/**
 * Register a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {Object} [metadata] - Optional user metadata (e.g. { first_name, last_name }).
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function register(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });
    return { data, error };
}

/**
 * Sign in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

/**
 * Sign out the current user.
 * @returns {Promise<{ error: Object|null }>}
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Get the currently authenticated user (from the active session).
 * @returns {Promise<{ data: { user: Object|null }, error: Object|null }>}
 */
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
}

/**
 * Get the current session (access token, refresh token, etc.).
 * @returns {Promise<{ data: { session: Object|null }, error: Object|null }>}
 */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
}

/**
 * Listen for auth state changes (login, logout, token refresh).
 * @param {Function} callback - Called with (event, session).
 * @returns {{ data: { subscription: Object } }} The subscription object (call .unsubscribe() to stop).
 */
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
}

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
}

/**
 * Update the current user's password (requires active session).
 * @param {string} newPassword
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    return { data, error };
}
