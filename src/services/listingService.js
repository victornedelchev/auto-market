/**
 * Listing Service.
 * Handles CRUD operations for car listings via Supabase Database.
 * Assumes a "listings" table exists in the Supabase project.
 */
import { supabase } from './supabase.js';

const TABLE = 'car_listings';

/**
 * Fetch all listings with optional filters, sorting, and pagination.
 * @param {Object} [options]
 * @param {number} [options.page=1] - Current page (1-indexed).
 * @param {number} [options.limit=12] - Items per page.
 * @param {string} [options.sortBy='created_at'] - Column to sort by.
 * @param {boolean} [options.ascending=false] - Sort direction.
 * @param {Object} [options.filters] - Key-value pairs for exact-match filters.
 * @param {string} [options.search] - Free-text search keyword (matches title).
 * @param {number} [options.minPrice]
 * @param {number} [options.maxPrice]
 * @param {number} [options.minYear]
 * @param {number} [options.maxYear]
 * @returns {Promise<{ data: Array|null, count: number|null, error: Object|null }>}
 */
export async function getListings({
    page = 1,
    limit = 12,
    sortBy = 'created_at',
    ascending = false,
    filters = {},
    search = '',
    minPrice,
    maxPrice,
    minYear,
    maxYear
} = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from(TABLE)
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending })
        .range(from, to);

    // Apply exact-match filters (e.g. fuel_type, transmission)
    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
            if (key === 'brand' || key === 'model') {
                query = query.ilike(key, `%${value}%`);
            } else {
                query = query.eq(key, value);
            }
        }
    }

    // Apply range filters
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        query = query.gte('price', minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        query = query.lte('price', maxPrice);
    }
    if (minYear !== undefined && minYear !== null && minYear !== '') {
        query = query.gte('year', minYear);
    }
    if (maxYear !== undefined && maxYear !== null && maxYear !== '') {
        query = query.lte('year', maxYear);
    }

    // Apply keyword search
    if (search) {
        query = query.or(`title.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`);
    }

    const { data, count, error } = await query;
    return { data, count, error };
}

/**
 * Fetch a single listing by its ID.
 * @param {string} id - The listing UUID.
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function getListingById(id) {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();

    return { data, error };
}

/**
 * Create a new listing.
 * @param {Object} listingData - The listing fields (title, price, year, etc.).
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function createListing(listingData) {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(listingData)
        .select()
        .single();

    return { data, error };
}

/**
 * Update an existing listing by ID.
 * @param {string} id - The listing UUID.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function updateListing(id, updates) {
    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

/**
 * Delete a listing by ID.
 * @param {string} id - The listing UUID.
 * @returns {Promise<{ error: Object|null }>}
 */
export async function deleteListing(id) {
    const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id);

    return { error };
}

/**
 * Fetch listings owned by a specific user.
 * @param {string} userId - The user's UUID.
 * @param {Object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=12]
 * @returns {Promise<{ data: Array|null, count: number|null, error: Object|null }>}
 */
export async function getListingsByUser(userId, { page = 1, limit = 12 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from(TABLE)
        .select('*', { count: 'exact' })
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

    return { data, count, error };
}

/**
 * Fetch the user's favorite listings.
 * Assumes a "favorites" join table with columns: user_id, listing_id.
 * @param {string} userId
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
export async function getFavorites(userId, { page = 1, limit = 12 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('favorites')
        .select('listing_id, car_listings(*)', { count: 'exact' })
        .eq('user_id', userId)
        .range(from, to);

    return { data, count, error };
}

/**
 * Add a listing to the user's favorites.
 * @param {string} userId
 * @param {string} listingId
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function addFavorite(userId, listingId) {
    const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, listing_id: listingId })
        .select()
        .single();

    return { data, error };
}

/**
 * Remove a listing from the user's favorites.
 * @param {string} userId
 * @param {string} listingId
 * @returns {Promise<{ error: Object|null }>}
 */
export async function removeFavorite(userId, listingId) {
    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', listingId);

    return { error };
}
