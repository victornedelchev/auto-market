/**
 * Admin Service
 * Handles admin-specific operations like fetching users, deactivating users, and getting stats.
 */
import { supabase } from './supabase.js';
import { removeAvatar } from './profileService.js';
import { deleteAllListingImages } from './storageService.js';

/**
 * Fetch all users (profiles) and their roles.
 */
export async function getAllUsers({ page = 1, limit = 10 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('profiles')
        .select(`
            *,
            user_roles ( role )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
    
    return { data, count, error };
}

/**
 * Deactivate a user profile.
 * @param {string} userId - The ID of the user to deactivate.
 */
export async function deactivateUser(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId)
        .select()
        .single();
    
    return { data, error };
}

/**
 * Activate a user profile.
 * @param {string} userId - The ID of the user to activate.
 */
export async function activateUser(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId)
        .select()
        .single();
    
    return { data, error };
}

/**
 * Get admin statistics (users, listings, images).
 */
export async function getAdminStats() {
    const { data, error } = await supabase.rpc('get_admin_stats');
    return { data, error };
}

/**
 * Set a user's role securely via RPC.
 * @param {string} userId
 * @param {string} role ('admin' or 'user')
 */
export async function setRole(userId, role) {
    const { data, error } = await supabase.rpc('admin_set_role', { target_user_id: userId, new_role: role });
    return { data, error };
}

/**
 * Hard delete a user completely from the database and storage.
 * @param {string} userId
 */
export async function deleteUser(userId) {
    try {
        // 1. Fetch all listings owned by the user
        const { data: listings } = await supabase
            .from('car_listings')
            .select('id')
            .eq('seller_id', userId);

        // 2. Delete all listing images from storage
        if (listings && listings.length > 0) {
            for (const listing of listings) {
                await deleteAllListingImages(listing.id);
            }
        }

        // 3. Delete user's avatar from storage
        await removeAvatar(userId);

        // 4. Delete the listings from the DB
        await supabase
            .from('car_listings')
            .delete()
            .eq('seller_id', userId);

        // 5. Delete the profile from the DB
        await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        // 6. Call the RPC to delete the auth user
        const { data, error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
        
        return { data, error };
    } catch (err) {
        return { data: null, error: err };
    }
}

/**
 * Update a user's profile details.
 * @param {string} userId 
 * @param {Object} updates 
 */
export async function updateUserProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    return { data, error };
}

/**
 * Check if the current user is an admin.
 * @param {string} userId 
 */
export async function checkIsAdmin(userId) {
    if (!userId) return false;
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
    
    if (error || !data) return false;
    return true;
}

// Trigger Vite HMR
