/**
 * Listing Details page.
 * Fetches and displays dynamic listing data, seller info, and action buttons.
 */
import { renderImageGallery } from '../../components/imageGallery/imageGallery.js';
import { getListingById, deleteListing, getFavorites, addFavorite, removeFavorite } from '../../services/listingService.js';
import { getProfile } from '../../services/profileService.js';
import { getListingImageUrls, deleteAllListingImages } from '../../services/storageService.js';
import { getUser } from '../../utils/authState.js';
import { showToast } from '../../utils/toastService.js';
import { navigateTo } from '../../utils/router.js';
import { showConfirmModal } from '../../utils/modalService.js';

export function renderDetailsPage(params = {}) {
    return `
    <div class="container py-4" id="details-page-content">
        <!-- Loading Spinner -->
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>`;
}

export async function initDetailsPage(params = {}) {
    const { id } = params;
    if (!id || id === 'unknown') {
        navigateTo('/browse');
        return;
    }

    const container = document.getElementById('details-page-content');
    if (!container) return;

    try {
        // Fetch data
        const { data: listing, error: listingError } = await getListingById(id);
        
        if (listingError || !listing) {
            showToast('Listing not found.', 'error');
            navigateTo('/browse');
            return;
        }

        const { data: seller } = await getProfile(listing.seller_id);
        const { urls: images } = await getListingImageUrls(id);
        const user = getUser();
        
        const isOwner = user && user.id === listing.seller_id;
        let isFavorite = false;

        if (user) {
            const { data: favorites } = await getFavorites(user.id);
            if (favorites) {
                isFavorite = favorites.some(f => f.listing_id === id);
            }
        }

        // Default placeholder if no images
        const galleryImages = images && images.length > 0 ? images : ['https://dummyimage.com/800x400/1e293b/64748b&text=No+Image+Available'];
        const galleryHtml = renderImageGallery(galleryImages);

        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(listing.price);
        const publishDate = new Date(listing.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const avatarUrl = seller?.avatar_url || null;
        const sellerInitials = (seller?.username || 'User').substring(0, 2).toUpperCase();
        
        let avatarHtml = `<div style="width: 52px; height: 52px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--am-font-display); font-weight: 700; font-size: 1.1rem;">${sellerInitials}</div>`;
        if (avatarUrl) {
            avatarHtml = `<img src="${avatarUrl}" alt="Avatar" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--am-light);">`;
        }

        // Render HTML
        container.innerHTML = `
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#/"><i class="bi bi-house-door me-1"></i>Home</a></li>
                    <li class="breadcrumb-item"><a href="#/browse">Browse</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${listing.title}</li>
                </ol>
            </nav>

            <div class="row g-4 align-items-stretch">
                <!-- Image Gallery -->
                <div class="col-lg-7 anim-slide-right d-flex" id="details-gallery-container">
                    ${galleryHtml}
                </div>

                <!-- Listing Info Panel -->
                <div class="col-lg-5 anim-slide-up">
                    <div class="card-am-static p-4 h-100 d-flex flex-column">
                        <div class="d-flex align-items-start justify-content-between mb-2">
                            <div>
                                <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.6rem; margin-bottom: 0.25rem;">${listing.title}</h1>
                                <p style="color: var(--am-gray); font-size: 0.9rem; margin: 0;">${listing.brand} · ${listing.model} · ${listing.year}</p>
                            </div>
                            <button id="btn-favorite" class="btn" style="color: ${isFavorite ? 'var(--am-danger)' : 'var(--am-gray)'}; font-size: 1.3rem; padding: 4px 8px;" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                                <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            </button>
                        </div>

                        <div style="background: var(--am-primary-50); border-radius: var(--am-radius-sm); padding: 1rem 1.25rem; margin: 1rem 0;">
                            <div class="d-flex align-items-baseline gap-2">
                                <span style="font-family: var(--am-font-display); font-weight: 900; font-size: 2rem; color: var(--am-primary);">${formattedPrice}</span>
                            </div>
                            <span style="font-size: 0.8rem; color: var(--am-gray);">
                                Published on ${publishDate}
                            </span>
                        </div>

                        <!-- Specs Grid -->
                        <div class="row g-2 mb-4">
                            <div class="col-6">
                                <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <i class="bi bi-calendar3" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                    <div>
                                        <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Year</div>
                                        <div style="font-weight: 600; font-size: 0.95rem;">${listing.year}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <i class="bi bi-speedometer2" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                    <div>
                                        <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Mileage</div>
                                        <div style="font-weight: 600; font-size: 0.95rem;">${listing.mileage.toLocaleString()} km</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <i class="bi bi-fuel-pump" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                    <div>
                                        <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Fuel</div>
                                        <div style="font-weight: 600; font-size: 0.95rem; text-transform: capitalize;">${listing.fuel_type}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <i class="bi bi-gear-wide-connected" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                    <div>
                                        <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Transmission</div>
                                        <div style="font-weight: 600; font-size: 0.95rem; text-transform: capitalize;">${listing.transmission}</div>
                                    </div>
                                </div>
                            </div>
                            ${listing.color ? `
                            <div class="col-6">
                                <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <i class="bi bi-palette" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                    <div>
                                        <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Color</div>
                                        <div style="font-weight: 600; font-size: 0.95rem; text-transform: capitalize;">${listing.color}</div>
                                    </div>
                                </div>
                            </div>` : ''}
                            <div class="col-6">
                                <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <i class="bi bi-geo-alt" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                    <div>
                                        <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Location</div>
                                        <div style="font-weight: 600; font-size: 0.95rem; text-transform: capitalize;">${listing.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-auto d-flex flex-column gap-2">
                            <div class="d-flex gap-2">
                                ${isOwner ? `
                                    <button id="btn-edit" class="btn btn-am-primary flex-fill">
                                        <i class="bi bi-pencil me-2"></i>Edit
                                    </button>
                                    <button id="btn-delete" class="btn btn-am-outline text-danger flex-fill">
                                        <i class="bi bi-trash me-2"></i>Delete
                                    </button>
                                ` : `
                                    <button class="btn btn-am-primary flex-fill" onclick="window.location.href='mailto:${seller?.email || ''}'">
                                        <i class="bi bi-envelope me-2"></i>Contact Seller
                                    </button>
                                `}
                            </div>
                            <a href="#/pdf/${listing.id}" class="btn btn-am-outline w-100">
                                <i class="bi bi-file-earmark-pdf me-2"></i>View as PDF
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description & Seller Info -->
            <div class="row mt-4 g-4">
                <div class="col-lg-8 animate-on-scroll">
                    <div class="card-am-static p-4 h-100">
                        <div class="section-header">
                            <div class="section-icon"><i class="bi bi-text-paragraph"></i></div>
                            <h3 style="font-size: 1.2rem;">Description</h3>
                        </div>
                        <p style="color: var(--am-dark-600); line-height: 1.8; white-space: pre-wrap;">${listing.description || 'No description provided.'}</p>
                        
                        ${listing.search_keywords ? `
                        <div class="mt-4 pt-3" style="border-top: 1px dashed #e2e8f0;">
                            <div class="d-flex flex-wrap gap-2">
                                ${listing.search_keywords.split(',').map(kw => `
                                    <span class="badge rounded-pill" style="background: var(--am-primary-100); color: var(--am-primary); font-weight: 500; font-size: 0.85rem; padding: 0.4rem 0.8rem; border: 1px solid var(--am-primary-200);">
                                        #${kw.trim().replace(/\s+/g, '').toLowerCase()}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Seller Info -->
                <div class="col-lg-4 animate-on-scroll delay-200">
                    <div class="card-am-static p-4 h-100">
                        <div class="section-header">
                            <div class="section-icon"><i class="bi bi-person"></i></div>
                            <h3 style="font-size: 1.2rem;">Seller</h3>
                        </div>
                        <div class="d-flex align-items-center gap-3 mb-3">
                            ${avatarHtml}
                            <div>
                                <h6 style="margin: 0; font-weight: 600;">${seller?.full_name || seller?.username || 'Unknown User'}</h6>
                                <div style="font-size: 0.85rem; color: var(--am-gray); margin-top: 2px;">
                                    ${seller?.city ? `<i class="bi bi-geo-alt me-1"></i>${seller.city}` : ''}
                                </div>
                            </div>
                        </div>
                        <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem;">
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <i class="bi bi-telephone" style="color: var(--am-gray); font-size: 0.85rem;"></i>
                                <span style="font-size: 0.85rem; color: var(--am-gray);">${seller?.phone || 'No phone provided'}</span>
                            </div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <i class="bi bi-envelope" style="color: var(--am-gray); font-size: 0.85rem;"></i>
                                <span style="font-size: 0.85rem; color: var(--am-gray);">${seller?.email || 'No email provided'}</span>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-clock" style="color: var(--am-gray); font-size: 0.85rem;"></i>
                                <span style="font-size: 0.85rem; color: var(--am-gray);">Joined ${seller ? new Date(seller.created_at).getFullYear() : 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize animations
        const { initScrollAnimations } = await import('../../utils/animations.js');
        initScrollAnimations();

        // Event Listeners
        const favBtn = document.getElementById('btn-favorite');
        if (favBtn) {
            favBtn.addEventListener('click', async () => {
                if (!user) {
                    showToast('Please log in to add favorites.', 'warning');
                    navigateTo('/login');
                    return;
                }
                
                const icon = favBtn.querySelector('i');
                try {
                    if (isFavorite) {
                        await removeFavorite(user.id, id);
                        isFavorite = false;
                        icon.classList.replace('bi-heart-fill', 'bi-heart');
                        favBtn.style.color = 'var(--am-gray)';
                        favBtn.title = 'Add to favorites';
                    } else {
                        await addFavorite(user.id, id);
                        isFavorite = true;
                        icon.classList.replace('bi-heart', 'bi-heart-fill');
                        favBtn.style.color = 'var(--am-danger)';
                        favBtn.title = 'Remove from favorites';
                    }
                } catch (err) {
                    showToast('Failed to update favorites.', 'error');
                }
            });
        }

        if (isOwner) {
            document.getElementById('btn-edit')?.addEventListener('click', () => {
                navigateTo(`/edit/${id}`);
            });

            document.getElementById('btn-delete')?.addEventListener('click', async () => {
                const confirmed = await showConfirmModal(
                    'Delete Listing',
                    'Are you sure you want to delete this listing? This action cannot be undone.',
                    'Delete',
                    'primary'
                );
                
                if (confirmed) {
                    try {
                        // Delete images first
                        await deleteAllListingImages(id);
                        // Then delete listing
                        const { error } = await deleteListing(id);
                        if (error) throw error;
                        
                        showToast('Listing deleted successfully.', 'success');
                        navigateTo('/profile');
                    } catch (err) {
                        console.error(err);
                        showToast('Failed to delete listing.', 'error');
                    }
                }
            });
        }

    } catch (err) {
        console.error('Error initializing details page:', err);
        showToast('An error occurred while loading the listing.', 'error');
        navigateTo('/browse');
    }
}
