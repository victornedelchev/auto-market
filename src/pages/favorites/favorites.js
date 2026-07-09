/**
 * Favorites page.
 * Fetches and displays the user's favorite listings.
 */
import { renderListingCard } from '../../components/listingCard/listingCard.js';
import { getFavorites, removeFavorite } from '../../services/listingService.js';
import { getListingImageUrls } from '../../services/storageService.js';
import { getUser } from '../../utils/authState.js';
import { navigateTo } from '../../utils/router.js';
import { showToast } from '../../utils/toastService.js';

export function renderFavoritesPage() {
    return `
    <!-- Page Header -->
    <div style="background: var(--am-gradient-hero); padding: 2.5rem 0 3rem;">
        <div class="container">
            <div class="d-flex align-items-center gap-3">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(239,68,68,0.15); display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-heart-fill" style="color: #fca5a5; font-size: 1.3rem;"></i>
                </div>
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff; margin: 0;">My Favorites</h1>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;" id="favorites-count-label">Loading...</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2;" id="favorites-page-content">
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>`;
}

export async function initFavoritesPage() {
    const user = getUser();
    if (!user) {
        showToast('Please log in to view your favorites.', 'warning');
        navigateTo('/login');
        return;
    }

    const container = document.getElementById('favorites-page-content');
    const countLabel = document.getElementById('favorites-count-label');
    if (!container) return;

    try {
        const { data: favorites, error } = await getFavorites(user.id);
        
        if (error) {
            throw error;
        }

        if (!favorites || favorites.length === 0) {
            countLabel.textContent = '0 saved cars';
            container.innerHTML = `
                <div class="card-am-static text-center py-5 px-4">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: #fee2e2; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                        <i class="bi bi-heart" style="font-size: 2rem; color: var(--am-danger);"></i>
                    </div>
                    <h4 style="font-family: var(--am-font-display);">No favorites yet</h4>
                    <p style="color: var(--am-gray); max-width: 400px; margin: 0.5rem auto 1.5rem;">
                        Start browsing and tap the heart icon on any listing to save it here.
                    </p>
                    <a href="#/browse" class="btn btn-am-primary">
                        <i class="bi bi-search me-1"></i>Browse Cars
                    </a>
               </div>`;
            return;
        }

        countLabel.textContent = `${favorites.length} saved car${favorites.length === 1 ? '' : 's'}`;

        // Fetch images for each listing
        const listingsWithImages = await Promise.all(favorites.map(async (fav) => {
            const listing = fav.car_listings;
            const { urls } = await getListingImageUrls(listing.id);
            return {
                ...listing,
                isFavorite: true,
                image: urls && urls.length > 0 ? urls[0] : 'https://dummyimage.com/400x250/1e293b/94a3b8&text=No+Image'
            };
        }));

        container.innerHTML = `
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4" id="favorites-grid">
                ${listingsWithImages.map(l => renderListingCard(l)).join('')}
            </div>
        `;

        // Add event listeners for the remove from favorites buttons
        const grid = document.getElementById('favorites-grid');
        grid.addEventListener('click', async (e) => {
            const btn = e.target.closest('.favorite-btn');
            if (!btn) return;
            
            const listingId = btn.getAttribute('data-id');
            if (listingId) {
                try {
                    await removeFavorite(user.id, listingId);
                    
                    // Remove the card from the UI
                    const card = document.getElementById(`listing-card-${listingId}`);
                    if (card) {
                        card.remove();
                    }
                    
                    // Update count
                    const currentCards = grid.querySelectorAll('.col').length;
                    countLabel.textContent = `${currentCards} saved car${currentCards === 1 ? '' : 's'}`;
                    
                    // If empty, show empty state
                    if (currentCards === 0) {
                        container.innerHTML = `
                            <div class="card-am-static text-center py-5 px-4">
                                <div style="width: 80px; height: 80px; border-radius: 50%; background: #fee2e2; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                                    <i class="bi bi-heart" style="font-size: 2rem; color: var(--am-danger);"></i>
                                </div>
                                <h4 style="font-family: var(--am-font-display);">No favorites yet</h4>
                                <p style="color: var(--am-gray); max-width: 400px; margin: 0.5rem auto 1.5rem;">
                                    Start browsing and tap the heart icon on any listing to save it here.
                                </p>
                                <a href="#/browse" class="btn btn-am-primary">
                                    <i class="bi bi-search me-1"></i>Browse Cars
                                </a>
                           </div>`;
                    }
                } catch (err) {
                    showToast('Failed to remove from favorites.', 'error');
                }
            }
        });

    } catch (err) {
        console.error('Error loading favorites:', err);
        showToast('Could not load favorites.', 'error');
        container.innerHTML = `<div class="alert alert-danger">An error occurred while loading your favorites.</div>`;
    }
}
