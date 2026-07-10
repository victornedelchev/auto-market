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

let currentFavoritesPage = 1;
const FAVORITES_PER_PAGE = 9;

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

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2;">
        <div id="favorites-page-content">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
        <div id="favorites-pagination" class="d-flex justify-content-center mt-5 mb-4"></div>
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
    if (!container) return;
    
    // Set up event delegation for unfavorite
    container.addEventListener('click', async (e) => {
        const btn = e.target.closest('.favorite-btn');
        if (!btn) return;
        
        const listingId = btn.getAttribute('data-id');
        if (listingId) {
            try {
                await removeFavorite(user.id, listingId);
                loadFavorites(currentFavoritesPage);
            } catch (err) {
                showToast('Failed to remove from favorites.', 'error');
            }
        }
    });

    loadFavorites();
}

async function loadFavorites(page = 1) {
    const user = getUser();
    if (!user) return;

    currentFavoritesPage = page;
    const container = document.getElementById('favorites-page-content');
    const countLabel = document.getElementById('favorites-count-label');
    const paginationContainer = document.getElementById('favorites-pagination');
    if (!container) return;

    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';
    
    try {
        const { data: favorites, count, error } = await getFavorites(user.id, { page, limit: FAVORITES_PER_PAGE });
        
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
        let listingsWithImages = await Promise.all(favorites.map(async (fav) => {
            let listing = fav.car_listings;
            if (Array.isArray(listing)) listing = listing[0];
            
            if (!listing || !listing.id) return null;

            let urls = [];
            try {
                const result = await getListingImageUrls(listing.id);
                urls = result.urls;
            } catch (err) {
                console.error('Failed to get images for listing', listing.id, err);
            }

            return {
                ...listing,
                isFavorite: true,
                fuel: listing.fuel_type,
                image: urls && urls.length > 0 ? urls[0] : 'https://dummyimage.com/400x250/1e293b/94a3b8&text=No+Image'
            };
        }));

        listingsWithImages = listingsWithImages.filter(l => l !== null);

        container.innerHTML = `
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4 mt-3" id="favorites-grid">
                ${listingsWithImages.map(l => renderListingCard(l)).join('')}
            </div>
        `;

        const { initScrollAnimations } = await import('../../utils/animations.js');
        initScrollAnimations();
        
        renderPagination(
            'favorites-pagination', 
            currentFavoritesPage, 
            Math.ceil(count / FAVORITES_PER_PAGE), 
            (newPage) => loadFavorites(newPage)
        );

    } catch (err) {
        console.error('Error loading favorites:', err);
        showToast('Could not load favorites.', 'error');
        container.innerHTML = `<div class="alert alert-danger">An error occurred while loading your favorites.</div>`;
    }
}

function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<ul class="pagination pagination-sm mb-0">';
    
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage - 1}">&laquo;</button>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" data-page="${i}">${i}</button>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage + 1}">&raquo;</button>
        </li>
    </ul>`;

    container.innerHTML = html;

    const buttons = container.querySelectorAll('button.page-link');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newPage = parseInt(e.target.getAttribute('data-page'), 10);
            if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                onPageChange(newPage);
            }
        });
    });
}
