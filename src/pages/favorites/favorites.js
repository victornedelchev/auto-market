/**
 * Favorites page.
 * Premium favorites with header and empty-state.
 */
import { renderListingCard } from '../../components/listingCard/listingCard.js';

/**
 * Render the favorites page.
 * @returns {string} The page markup.
 */
export function renderFavoritesPage() {
    const placeholderFavorites = [
        { id: '3', title: 'Audi A4 Avant 40 TFSI', price: 34900, year: 2023, fuel: 'Petrol', mileage: 15000 },
        { id: '5', title: 'Tesla Model 3 Long Range', price: 42000, year: 2023, fuel: 'Electric', mileage: 8000 },
    ];

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
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;">${placeholderFavorites.length} saved cars</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2;">
        ${placeholderFavorites.length > 0
            ? `<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                    ${placeholderFavorites.map(l => renderListingCard(l)).join('')}
               </div>`
            : `<div class="card-am-static text-center py-5 px-4">
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
               </div>`
        }
    </div>`;
}
