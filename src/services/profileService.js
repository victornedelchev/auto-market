/**
 * Profile Service.
 * Handles user profile CRUD via Supabase Database.
 * Assumes a "profiles" table exists (typically auto-created via a trigger on auth.users).
 */
import { supabase } from './supabase.js';

const TABLE = 'profiles';

/**
 * Fetch a user profile by user ID.
 * @param {string} userId - The user's UUID (from auth).
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', userId)
        .single();

    return { data, error };
}

/**
 * Update a user's profile.
 * @param {string} userId
 * @param {Object} updates - Fields to update (e.g. { first_name, last_name, avatar_url, phone }).
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
}

/**
 * Upload a user avatar image to Supabase Storage.
 * Stores under "avatars/{userId}.{ext}".
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<{ url: string|null, error: Object|null }>}
 */
export async function uploadAvatar(userId, file) {
    const ext = file.name.split('.').pop();
    const filePath = `${userId}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) return { url: null, error: uploadError };

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Update the profile record with the new avatar URL
    const { error: updateError } = await supabase
        .from(TABLE)
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

    if (updateError) return { url: data.publicUrl, error: updateError };

    return { url: data.publicUrl, error: null };
}

/**
 * Get the public stats for a user (listing count, favorites count).
 * @param {string} userId
 * @returns {Promise<{ listings: number, favorites: number, error: Object|null }>}
 */
export async function getUserStats(userId) {
    const [listingsResult, favoritesResult] = await Promise.all([
        supabase
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId),
        supabase
            .from('favorites')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId),
    ]);

    return {
        listings: listingsResult.count ?? 0,
        favorites: favoritesResult.count ?? 0,
        error: listingsResult.error || favoritesResult.error || null,
    };
}

/**
 * Check if a user has admin role.
 * Assumes a "role" column exists on the profiles table.
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
    const { data, error } = await supabase
        .from(TABLE)
        .select('role')
        .eq('id', userId)
        .single();

    if (error || !data) return false;
    return data.role === 'admin';
}
