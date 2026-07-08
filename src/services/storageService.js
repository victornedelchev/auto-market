/**
 * Storage Service.
 * Handles file uploads and URL generation via Supabase Storage.
 * Assumes a "listing-images" bucket exists in Supabase Storage.
 */
import { supabase } from './supabase.js';

const BUCKET = 'listing-images';

/**
 * Upload a single image file to Supabase Storage.
 * Files are stored under: {listingId}/{timestamp}_{filename}
 * @param {string} listingId - The listing UUID (used as folder name).
 * @param {File} file - The File object to upload.
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function uploadImage(listingId, file) {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${listingId}/${timestamp}_${safeName}`;

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    return { data, error };
}

/**
 * Upload multiple image files for a listing.
 * @param {string} listingId
 * @param {FileList|File[]} files - The files to upload.
 * @returns {Promise<{ successful: Array, failed: Array }>}
 */
export async function uploadMultipleImages(listingId, files) {
    const successful = [];
    const failed = [];

    for (const file of files) {
        const { data, error } = await uploadImage(listingId, file);
        if (error) {
            failed.push({ file: file.name, error });
        } else {
            successful.push({ file: file.name, data });
        }
    }

    return { successful, failed };
}

/**
 * Get the public URL for a file in the bucket.
 * @param {string} filePath - The path within the bucket.
 * @returns {string} The public URL.
 */
export function getPublicUrl(filePath) {
    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * List all images in a listing's folder.
 * @param {string} listingId - The listing UUID.
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
export async function listImages(listingId) {
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(listingId, {
            limit: 20,
            sortBy: { column: 'created_at', order: 'asc' },
        });

    return { data, error };
}

/**
 * Get public URLs for all images belonging to a listing.
 * @param {string} listingId
 * @returns {Promise<{ urls: string[], error: Object|null }>}
 */
export async function getListingImageUrls(listingId) {
    const { data, error } = await listImages(listingId);

    if (error) return { urls: [], error };

    const urls = data
        .filter(file => !file.name.startsWith('.'))
        .map(file => getPublicUrl(`${listingId}/${file.name}`));

    return { urls, error: null };
}

/**
 * Delete a single image from storage.
 * @param {string} filePath - The full path within the bucket.
 * @returns {Promise<{ error: Object|null }>}
 */
export async function deleteImage(filePath) {
    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([filePath]);

    return { error };
}

/**
 * Delete all images for a listing.
 * @param {string} listingId
 * @returns {Promise<{ error: Object|null }>}
 */
export async function deleteAllListingImages(listingId) {
    const { data, error: listError } = await listImages(listingId);
    if (listError) return { error: listError };

    if (!data || data.length === 0) return { error: null };

    const paths = data.map(file => `${listingId}/${file.name}`);

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove(paths);

    return { error };
}
