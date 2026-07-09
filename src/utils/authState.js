/**
 * Auth State Manager.
 * Centralized singleton that caches the current user and session.
 * All modules read auth state from here instead of calling Supabase directly.
 */
import { getSession, onAuthStateChange } from '../services/authService.js';
import { getProfile } from '../services/profileService.js';
import { checkIsAdmin } from '../services/adminService.js';

/** @type {import('@supabase/supabase-js').User|null} */
let currentUser = null;

/** @type {Object|null} */
let currentProfile = null;

/** @type {boolean} */
let currentUserIsAdmin = false;

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
  if (currentUser) {
      const { data: profile } = await getProfile(currentUser.id);
      currentProfile = profile;
      currentUserIsAdmin = await checkIsAdmin(currentUser.id);
  }

  // Subscribe to future auth events (login, logout, token refresh)
  onAuthStateChange(async (_event, session) => {
    currentUser = session?.user ?? null;
    if (currentUser) {
        const { data: profile } = await getProfile(currentUser.id);
        currentProfile = profile;
        currentUserIsAdmin = await checkIsAdmin(currentUser.id);
    } else {
        currentProfile = null;
        currentUserIsAdmin = false;
    }
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
 * Check if the currently authenticated user is an admin.
 * @returns {boolean}
 */
export function isAdminUser() {
  return currentUserIsAdmin;
}

/**
 * Get the currently authenticated user's profile (synchronous).
 * @returns {Object|null}
 */
export function getUserProfile() {
  return currentProfile;
}

/**
 * Force a refresh of the cached profile and notify listeners (e.g. navbar).
 */
export async function forceProfileRefresh() {
    if (currentUser) {
        const { data } = await getProfile(currentUser.id);
        currentProfile = data;
        notifyListeners();
    }
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
