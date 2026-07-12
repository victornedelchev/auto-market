/**
 * Listing Card component.
 * Premium card with image overlay, hover lift, favorite button, and spec badges.
 */

/**
 * Render a single listing card.
 * @param {Object} options - Configuration options (e.g. showEdit).
 * @returns {string} The card markup.
 */
export function renderListingCard(listing = {}, options = {}) {
    const { showEdit = false } = options;
    const {
        id = '',
        title = 'Car Title',
        image = 'https://dummyimage.com/400x250/1e293b/94a3b8&text=No+Image',
        price = 0,
        year = new Date().getFullYear(),
        fuel = 'N/A',
        mileage = 0,
        search_keywords = ''
    } = listing;

    return `
    <div class="col animate-on-scroll" id="listing-card-${id}">
        <div class="listing-card h-100">
            <div class="card-img-wrapper img-hover-zoom" style="position: relative;">
                ${showEdit ? `<a href="#/edit/${id}" class="btn btn-sm btn-am-primary position-absolute" style="top: 12px; right: 12px; z-index: 10; border-radius: 6px; box-shadow: var(--am-shadow);"><i class="bi bi-pencil-square me-1"></i>Edit</a>` : ''}
                <img src="${image}" alt="${title}"
                     style="width: 100%; height: 200px; object-fit: cover; display: block;" />
                <button class="favorite-btn" data-id="${id}" title="${listing.isFavorite ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite">
                    <i class="bi ${listing.isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'}" style="font-size: 0.95rem;"></i>
                </button>
                <span style="
                    position: absolute;
                    top: 12px;
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
                    <span class="listing-badge"><i class="bi bi-speedometer2"></i>${mileage ? mileage.toLocaleString() : '0'} km</span>
                </div>
                ${search_keywords ? `
                <div class="d-flex flex-wrap gap-1 mb-3">
                    ${search_keywords.split(',').slice(0, 3).map(kw => `
                        <span style="font-size: 0.75rem; color: var(--am-primary); background: var(--am-primary-50); padding: 2px 8px; border-radius: 12px;">#${kw.trim().replace(/\s+/g, '').toLowerCase()}</span>
                    `).join('')}
                    ${search_keywords.split(',').length > 3 ? `<span style="font-size: 0.75rem; color: var(--am-gray); padding: 2px 4px;">+${search_keywords.split(',').length - 3}</span>` : ''}
                </div>
                ` : ''}
                <div class="mt-auto d-flex gap-2">
                    <a href="#/details/${id}" class="btn btn-am-primary btn-sm flex-grow-1">
                        View Details <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                    <button class="btn btn-am-info btn-sm compare-btn d-flex align-items-center justify-content-center gap-1" data-id="${id}" title="Select for AI comparison">
                        <i class="bi bi-robot"></i> <span style="font-size: 0.8rem; font-weight: 500;">Compare</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
