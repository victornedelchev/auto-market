/**
 * Browse Listings page.
 * Premium browse layout with header, filters, results grid, and pagination.
 */
import { renderSearchFilters } from '../../components/searchFilters/searchFilters.js';
import { renderListingCard } from '../../components/listingCard/listingCard.js';
import { renderPagination } from '../../components/pagination/pagination.js';

/**
 * Render the browse page.
 * @returns {string} The page markup.
 */
export function renderBrowsePage() {
    const placeholderListings = [
        { id: '1', title: 'BMW X5 M Sport', price: 45000, year: 2022, fuel: 'Diesel', mileage: 32000 },
        { id: '2', title: 'Mercedes-Benz C220d', price: 38500, year: 2021, fuel: 'Diesel', mileage: 41000 },
        { id: '3', title: 'Audi A4 Avant 40 TFSI', price: 34900, year: 2023, fuel: 'Petrol', mileage: 15000 },
        { id: '4', title: 'Volkswagen Golf 8 GTI', price: 27500, year: 2022, fuel: 'Petrol', mileage: 22000 },
        { id: '5', title: 'Tesla Model 3 Long Range', price: 42000, year: 2023, fuel: 'Electric', mileage: 8000 },
        { id: '6', title: 'Toyota RAV4 2.5 Hybrid', price: 35900, year: 2022, fuel: 'Hybrid', mileage: 28000 },
    ];

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
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;">Showing 1,247 results</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2;">
        ${renderSearchFilters()}

        <div class="d-flex justify-content-between align-items-center mb-3">
            <p style="color: var(--am-gray); font-size: 0.9rem; margin: 0;">
                <span style="font-weight: 600; color: var(--am-dark);">${placeholderListings.length}</span> cars found
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

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            ${placeholderListings.map(l => renderListingCard(l)).join('')}
        </div>

        <div class="card-am-static p-3 mb-4">
            ${renderPagination({ currentPage: 1, totalPages: 5 })}
        </div>
    </div>`;
}
