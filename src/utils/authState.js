/**
 * Auth State Manager.
 * Centralized singleton that caches the current user and session.
 * All modules read auth state from here instead of calling Supabase directly.
 */
import { getSession, onAuthStateChange } from '../services/authService.js';

/** @type {import('@supabase/supabase-js').User|null} */
let currentUser = null;

/** @type {Array<Function>} */
const listeners = [];

/**
 * Initialize auth state.
 * Retrieves the existing session (if any) and subscribes to auth changes.
 * Must be called once at app startup before the router initializes.
 * @returns {Promise<void>}
 */
export async function initAuth() {
  // Restore session from Supabase (persisted in localStorage by default)
  const { data } = await getSession();
  currentUser = data?.session?.user ?? null;

  // Subscribe to future auth events (login, logout, token refresh)
  onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    notifyListeners();
  });
}

/**
 * Get the currently authenticated user (synchronous).
 * @returns {import('@supabase/supabase-js').User|null}
 */
export function getUser() {
  return currentUser;
}

/**
 * Check if a user is currently authenticated.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return currentUser !== null;
}

/**
 * Register a callback invoked whenever auth state changes.
 * @param {Function} callback - Called with (user: User|null).
 * @returns {Function} Unsubscribe function.
 */
export function onAuthChange(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

/**
 * Notify all registered listeners of the current user.
 */
function notifyListeners() {
  for (const cb of listeners) {
    cb(currentUser);
  }
}
