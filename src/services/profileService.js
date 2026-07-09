/**
 * Profile Service.
 * Handles user profile CRUD via Supabase Database.
 * Profile records are auto-created by a trigger on auth.users.
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
        .maybeSingle();

    return { data, error };
}

/**
 * Update a user's profile.
 * @param {string} userId
 * @param {Object} updates - Fields to update (e.g. { full_name, phone, city, avatar_url }).
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
 * Stores under "avatars/{userId}/{timestamp}.{ext}" so RLS policies work.
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<{ url: string|null, error: Object|null }>}
 */
export async function uploadAvatar(userId, file) {
    const ext = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${ext}`;

    // Delete existing avatars for this user first
    await deleteUserAvatarFiles(userId);

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
 * Remove the user's avatar — deletes files from storage and clears avatar_url.
 * @param {string} userId
 * @returns {Promise<{ error: Object|null }>}
 */
export async function removeAvatar(userId) {
    // Delete files from storage
    await deleteUserAvatarFiles(userId);

    // Clear avatar_url on the profile
    const { error } = await supabase
        .from(TABLE)
        .update({ avatar_url: null })
        .eq('id', userId);

    return { error };
}

/**
 * Delete all avatar files for a user from storage.
 * @param {string} userId
 * @returns {Promise<void>}
 */
async function deleteUserAvatarFiles(userId) {
    const { data: files } = await supabase.storage
        .from('avatars')
        .list(userId);

    if (files && files.length > 0) {
        const paths = files.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from('avatars').remove(paths);
    }
}

/**
 * Get the public stats for a user (listing count, favorites count).
 * @param {string} userId
 * @returns {Promise<{ listings: number, favorites: number, error: Object|null }>}
 */
export async function getUserStats(userId) {
    const [listingsResult, favoritesResult] = await Promise.all([
        supabase
            .from('car_listings')
            .select('id', { count: 'exact', head: true })
            .eq('seller_id', userId),
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
 * Queries the user_roles table.
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

    if (error || !data) return false;
    return data.role === 'admin';
}
