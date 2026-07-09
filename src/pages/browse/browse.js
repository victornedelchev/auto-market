import { renderSearchFilters } from '../../components/searchFilters/searchFilters.js';
import { renderListingCard } from '../../components/listingCard/listingCard.js';
import { renderPagination } from '../../components/pagination/pagination.js';
import { getListings, getFavorites, addFavorite, removeFavorite } from '../../services/listingService.js';
import { getListingImageUrls } from '../../services/storageService.js';
import { getUser } from '../../utils/authState.js';
import { showToast } from '../../utils/toastService.js';
import { navigateTo } from '../../utils/router.js';

let currentPage = 1;
const itemsPerPage = 12;

/**
 * Render the browse page HTML structure.
 * @returns {string} The page markup.
 */
export function renderBrowsePage() {
    return `
    <!-- Page Header -->
    <div style="background: var(--am-gradient-hero); padding: 2.5rem 0 3rem;">
        <div class="container">
            <div class="d-flex align-items-center gap-3">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-grid-3x3-gap-fill" style="color: var(--am-accent-light); font-size: 1.3rem;"></i>
                </div>
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff; margin: 0;">Browse Cars</h1>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;" id="browse-header-count">Loading results...</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2;">
        ${renderSearchFilters()}

        <div class="d-flex justify-content-between align-items-center mb-3">
            <p style="color: var(--am-gray); font-size: 0.9rem; margin: 0;">
                <span style="font-weight: 600; color: var(--am-dark);" id="browse-results-count">0</span> cars found
            </p>
            <div class="d-flex gap-1">
                <button class="btn btn-sm" style="color: var(--am-primary); background: var(--am-primary-100); border-radius: 8px; padding: 6px 10px;">
                    <i class="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button class="btn btn-sm" style="color: var(--am-gray-light); padding: 6px 10px;">
                    <i class="bi bi-list-ul"></i>
                </button>
            </div>
        </div>

        <div id="browse-loading" class="text-center py-5" style="display: none;">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Fetching cars...</p>
        </div>

        <div id="browse-grid" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            <!-- Rendered listings go here -->
        </div>

        <div class="card-am-static p-3 mb-4" id="browse-pagination-container">
            <!-- Pagination goes here -->
        </div>
    </div>`;
}

/**
 * Initialize the browse page (attach events and fetch initial data).
 */
export function initBrowsePage() {
    currentPage = 1;
    const form = document.getElementById('search-filters-form');
    const handleSearchClick = () => {
        currentPage = 1;
        fetchAndRenderListings();
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            currentPage = 1;
            fetchAndRenderListings();
        });
        
        form.addEventListener('reset', () => {
            setTimeout(() => {
                currentPage = 1;
                fetchAndRenderListings();
            }, 0);
        });

        // Trigger search when the main Search button is clicked
        const searchBtn = document.getElementById('main-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', handleSearchClick);
        }
    }

    // Attach delegated event listener for pagination
    const paginationContainer = document.getElementById('browse-pagination-container');
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a[data-page]');
            if (link) {
                const newPage = parseInt(link.getAttribute('data-page'), 10);
                if (!isNaN(newPage) && newPage !== currentPage) {
                    currentPage = newPage;
                    fetchAndRenderListings();
                    // Scroll to top of grid
                    document.getElementById('browse-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    // Attach event listener for favorite buttons
    const grid = document.getElementById('browse-grid');
    if (grid) {
        grid.addEventListener('click', async (e) => {
            const btn = e.target.closest('.favorite-btn');
            if (!btn) return;

            const user = getUser();
            if (!user) {
                showToast('Please log in to add favorites.', 'warning');
                navigateTo('/login');
                return;
            }

            const listingId = btn.getAttribute('data-id');
            const icon = btn.querySelector('i');
            const isCurrentlyFavorite = icon.classList.contains('bi-heart-fill');

            try {
                if (isCurrentlyFavorite) {
                    await removeFavorite(user.id, listingId);
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    icon.classList.remove('text-danger');
                    btn.title = 'Add to favorites';
                } else {
                    await addFavorite(user.id, listingId);
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    icon.classList.add('text-danger');
                    btn.title = 'Remove from favorites';
                }
            } catch (err) {
                showToast('Failed to update favorites.', 'error');
            }
        });
    }

    fetchAndRenderListings();
}

/**
 * Fetch listings from Supabase and render them into the grid.
 */
async function fetchAndRenderListings() {
    const grid = document.getElementById('browse-grid');
    const loading = document.getElementById('browse-loading');
    const countDisplay = document.getElementById('browse-results-count');
    const headerCountDisplay = document.getElementById('browse-header-count');
    const paginationContainer = document.getElementById('browse-pagination-container');

    grid.style.display = 'none';
    loading.style.display = 'block';
    
    try {
        const search = document.getElementById('filter-keyword')?.value.trim() || '';
        const brand = document.getElementById('filter-make')?.value.trim() || '';
        const model = document.getElementById('filter-model')?.value.trim() || '';
        const fuel = document.getElementById('filter-fuel')?.value || '';
        const transmission = document.getElementById('filter-transmission')?.value || '';
        const minYear = parseInt(document.getElementById('filter-year-min')?.value, 10) || null;
        const maxYear = parseInt(document.getElementById('filter-year-max')?.value, 10) || null;
        const minPrice = parseInt(document.getElementById('filter-price-min')?.value, 10) || null;
        const maxPrice = parseInt(document.getElementById('filter-price-max')?.value, 10) || null;
        
        const sortOption = document.getElementById('filter-sort')?.value || 'newest';
        
        let sortBy = 'created_at';
        let ascending = false;
        
        if (sortOption === 'oldest') {
            sortBy = 'created_at';
            ascending = true;
        } else if (sortOption === 'price-asc') {
            sortBy = 'price';
            ascending = true;
        } else if (sortOption === 'price-desc') {
            sortBy = 'price';
            ascending = false;
        } else if (sortOption === 'mileage-asc') {
            sortBy = 'mileage';
            ascending = true;
        }

        const options = {
            page: currentPage,
            limit: itemsPerPage,
            sortBy,
            ascending,
            search,
            filters: {
                brand: brand || undefined,
                model: model || undefined,
                fuel_type: fuel || undefined,
                transmission: transmission || undefined,
                status: 'active'
            },
            minYear,
            maxYear,
            minPrice,
            maxPrice
        };

        const { data: listings, count, error } = await getListings(options);
        
        if (error) throw error;

        // Fetch favorites for current user to mark them in the UI
        let userFavoriteIds = new Set();
        const user = getUser();
        if (user) {
            const { data: favorites } = await getFavorites(user.id);
            if (favorites) {
                userFavoriteIds = new Set(favorites.map(f => f.listing_id));
            }
        }

        // Fetch cover images in parallel
        const listingsWithImages = await Promise.all((listings || []).map(async (listing) => {
            const { urls } = await getListingImageUrls(listing.id);
            if (urls && urls.length > 0) {
                listing.coverUrl = urls[0];
            } else {
                listing.coverUrl = 'https://dummyimage.com/600x400/e2e8f0/64748b&text=No+Image';
            }
            listing.isFavorite = userFavoriteIds.has(listing.id);
            return listing;
        }));

        // Render grid
        if (listingsWithImages.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No listings found matching your criteria.</div>';
        } else {
            grid.innerHTML = listingsWithImages.map(l => renderListingCard({
                ...l,
                image: l.coverUrl,
                fuel: l.fuel_type
            })).join('');
        }

        // Update counts
        const totalFound = count || 0;
        countDisplay.textContent = totalFound;
        headerCountDisplay.textContent = `Showing ${totalFound} result${totalFound !== 1 ? 's' : ''}`;

        // Update pagination
        const totalPages = Math.ceil(totalFound / itemsPerPage);
        paginationContainer.innerHTML = renderPagination({ currentPage, totalPages });

    } catch (err) {
        console.error('Failed to fetch listings:', err);
        grid.innerHTML = '<div class="col-12 text-center text-danger py-5">Failed to load listings. Please try again.</div>';
    } finally {
        loading.style.display = 'none';
        grid.style.display = 'flex';
    }
}
