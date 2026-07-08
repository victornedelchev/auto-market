/**
 * Image Gallery component.
 * Enhanced Bootstrap carousel with rounded corners and thumbnail indicators.
 */

/**
 * Render an image gallery carousel.
 * @param {string[]} images - Array of image URLs.
 * @param {string} [galleryId='carGallery'] - Unique ID for the carousel instance.
 * @returns {string} The gallery markup.
 */
export function renderImageGallery(images = [], galleryId = 'carGallery') {
    if (images.length === 0) {
        return `
        <div class="text-center py-5 rounded-3" style="background: var(--am-light); border: 2px dashed #e2e8f0;">
            <i class="bi bi-image" style="font-size: 3rem; color: var(--am-gray-light);"></i>
            <p style="color: var(--am-gray); margin-top: 0.75rem;">No images available</p>
        </div>`;
    }

    const indicators = images.map((_, index) => `
        <button type="button"
                data-bs-target="#${galleryId}"
                data-bs-slide-to="${index}"
                class="${index === 0 ? 'active' : ''}"
                aria-current="${index === 0 ? 'true' : 'false'}"
                aria-label="Slide ${index + 1}"
                style="width: 10px; height: 10px; border-radius: 50%; border: 2px solid #fff; opacity: ${index === 0 ? '1' : '0.5'};">
        </button>`).join('');

    const slides = images.map((src, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${src}" class="d-block w-100" alt="Car image ${index + 1}"
                 style="height: 420px; object-fit: cover;" />
        </div>`).join('');

    return `
    <div style="border-radius: var(--am-radius-lg); overflow: hidden; box-shadow: var(--am-shadow-lg); position: relative;">
        <div id="${galleryId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators" style="margin-bottom: 1rem;">
                ${indicators}
            </div>
            <div class="carousel-inner">
                ${slides}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${galleryId}" data-bs-slide="prev"
                    style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); top: 50%; transform: translateY(-50%); left: 12px; opacity: 1;">
                <span class="carousel-control-prev-icon" aria-hidden="true" style="width: 16px; height: 16px;"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${galleryId}" data-bs-slide="next"
                    style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); top: 50%; transform: translateY(-50%); right: 12px; opacity: 1;">
                <span class="carousel-control-next-icon" aria-hidden="true" style="width: 16px; height: 16px;"></span>
                <span class="visually-hidden">Next</span>
            </button>

            <!-- Image counter badge -->
            <span style="
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(0,0,0,0.55);
                backdrop-filter: blur(8px);
                color: #fff;
                padding: 4px 12px;
                border-radius: 99px;
                font-size: 0.8rem;
                font-weight: 500;
                z-index: 2;
            ">
                <i class="bi bi-images me-1"></i>${images.length} photos
            </span>
        </div>
    </div>`;
}
