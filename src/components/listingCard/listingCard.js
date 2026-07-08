/**
 * Listing Card component.
 * Premium card with image overlay, hover lift, favorite button, and spec badges.
 */

/**
 * Render a single listing card.
 * @param {Object} listing - The listing data object.
 * @returns {string} The card markup.
 */
export function renderListingCard(listing = {}) {
    const {
        id = '',
        title = 'Car Title',
        image = 'https://placehold.co/400x250/1e293b/94a3b8?text=No+Image',
        price = 0,
        year = new Date().getFullYear(),
        fuel = 'N/A',
        mileage = 0,
    } = listing;

    return `
    <div class="col">
        <div class="listing-card h-100">
            <div class="card-img-wrapper" style="position: relative;">
                <img src="${image}" alt="${title}"
                     style="width: 100%; height: 200px; object-fit: cover; display: block;" />
                <button class="favorite-btn" title="Add to favorites" aria-label="Add to favorites">
                    <i class="bi bi-heart" style="font-size: 0.95rem;"></i>
                </button>
                <span style="
                    position: absolute;
                    bottom: 12px;
                    left: 12px;
                    background: var(--am-gradient-primary);
                    color: #fff;
                    font-family: var(--am-font-display);
                    font-weight: 800;
                    font-size: 1.05rem;
                    padding: 5px 14px;
                    border-radius: var(--am-radius-full);
                    box-shadow: 0 2px 10px rgba(37,99,235,0.4);
                ">&euro;${price.toLocaleString()}</span>
            </div>
            <div class="p-3" style="display: flex; flex-direction: column; flex: 1;">
                <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 1rem; margin-bottom: 0.65rem; color: var(--am-dark);">
                    ${title}
                </h6>
                <div class="d-flex gap-2 flex-wrap mb-3">
                    <span class="listing-badge"><i class="bi bi-calendar3"></i>${year}</span>
                    <span class="listing-badge"><i class="bi bi-fuel-pump"></i>${fuel}</span>
                    <span class="listing-badge"><i class="bi bi-speedometer2"></i>${mileage.toLocaleString()} km</span>
                </div>
                <div class="mt-auto">
                    <a href="#/details/${id}" class="btn btn-am-outline btn-sm w-100">
                        View Details <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>`;
}
