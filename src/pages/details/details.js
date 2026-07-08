/**
 * Listing Details page.
 * Premium layout with gallery, specs, seller info, and action buttons.
 */
import { renderImageGallery } from '../../components/imageGallery/imageGallery.js';

/**
 * Render the listing details page.
 * @param {Object} params
 * @param {string} params.id
 * @returns {string} The page markup.
 */
export function renderDetailsPage(params = {}) {
    const { id = 'unknown' } = params;

    const gallery = renderImageGallery([
        'https://placehold.co/800x400/1e293b/64748b?text=Front+View',
        'https://placehold.co/800x400/1e293b/64748b?text=Side+View',
        'https://placehold.co/800x400/1e293b/64748b?text=Interior',
    ]);

    return `
    <div class="container py-4">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#/"><i class="bi bi-house-door me-1"></i>Home</a></li>
                <li class="breadcrumb-item"><a href="#/browse">Browse</a></li>
                <li class="breadcrumb-item active" aria-current="page">BMW X5 M Sport</li>
            </ol>
        </nav>

        <div class="row g-4">
            <!-- Image Gallery -->
            <div class="col-lg-7">
                ${gallery}
            </div>

            <!-- Listing Info Panel -->
            <div class="col-lg-5">
                <div class="card-am-static p-4">
                    <div class="d-flex align-items-start justify-content-between mb-2">
                        <div>
                            <span class="badge-am badge-am-success mb-2">
                                <i class="bi bi-check-circle me-1"></i>Verified
                            </span>
                            <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.6rem; margin-bottom: 0.25rem;">BMW X5 M Sport</h1>
                            <p style="color: var(--am-gray); font-size: 0.9rem; margin: 0;">3.0L Turbo Diesel · Automatic · 2022</p>
                        </div>
                        <button class="btn" style="color: var(--am-gray); font-size: 1.3rem; padding: 4px 8px;" title="Add to favorites">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>

                    <div style="background: var(--am-primary-50); border-radius: var(--am-radius-sm); padding: 1rem 1.25rem; margin: 1rem 0;">
                        <div class="d-flex align-items-baseline gap-2">
                            <span style="font-family: var(--am-font-display); font-weight: 900; font-size: 2rem; color: var(--am-primary);">&euro;45,000</span>
                            <span style="color: var(--am-gray-light); font-size: 0.85rem; text-decoration: line-through;">&euro;48,500</span>
                        </div>
                        <span style="font-size: 0.8rem; color: var(--am-success); font-weight: 500;">
                            <i class="bi bi-arrow-down me-1"></i>7% below market
                        </span>
                    </div>

                    <!-- Specs Grid -->
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="bi bi-calendar3" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                <div>
                                    <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Year</div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">2022</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="bi bi-speedometer2" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                <div>
                                    <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Mileage</div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">32,000 km</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="bi bi-fuel-pump" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                <div>
                                    <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Fuel</div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Diesel</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="bi bi-gear-wide-connected" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                <div>
                                    <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Transmission</div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Automatic</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="bi bi-palette" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                <div>
                                    <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Color</div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Black Sapphire</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="bi bi-geo-alt" style="color: var(--am-primary); font-size: 1.1rem;"></i>
                                <div>
                                    <div style="font-size: 0.72rem; color: var(--am-gray); text-transform: uppercase; letter-spacing: 0.04em;">Location</div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Sofia</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-flex gap-2">
                        <button class="btn btn-am-primary flex-fill">
                            <i class="bi bi-telephone me-2"></i>Contact Seller
                        </button>
                        <button class="btn btn-am-outline" style="padding: 0 1rem;">
                            <i class="bi bi-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Description -->
        <div class="row mt-4 g-4">
            <div class="col-lg-8">
                <div class="card-am-static p-4">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-text-paragraph"></i></div>
                        <h3 style="font-size: 1.2rem;">Description</h3>
                    </div>
                    <p style="color: var(--am-dark-600); line-height: 1.8;">
                        This stunning BMW X5 M Sport comes equipped with a powerful 3.0L twin-turbo diesel engine, delivering exceptional performance and fuel efficiency.
                        Full service history available, one owner from new. The vehicle is in pristine condition with no accidents reported.
                    </p>
                    <p style="color: var(--am-dark-600); line-height: 1.8;">
                        Features include panoramic sunroof, heated leather seats, heads-up display, Harman Kardon sound system, adaptive cruise control, and parking assistant plus.
                    </p>
                </div>
            </div>

            <!-- Seller Info -->
            <div class="col-lg-4">
                <div class="card-am-static p-4">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-person"></i></div>
                        <h3 style="font-size: 1.2rem;">Seller</h3>
                    </div>
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--am-font-display); font-weight: 700; font-size: 1.1rem;">
                            JD
                        </div>
                        <div>
                            <h6 style="margin: 0; font-weight: 600;">John Doe</h6>
                            <div class="d-flex align-items-center gap-1">
                                <i class="bi bi-star-fill" style="color: var(--am-accent); font-size: 0.75rem;"></i>
                                <span style="font-size: 0.82rem; color: var(--am-gray);">4.9 · 12 listings</span>
                            </div>
                        </div>
                    </div>
                    <div style="background: var(--am-light); border-radius: var(--am-radius-sm); padding: 0.75rem;">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <i class="bi bi-clock" style="color: var(--am-gray); font-size: 0.85rem;"></i>
                            <span style="font-size: 0.85rem; color: var(--am-gray);">Member since January 2023</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-reply" style="color: var(--am-gray); font-size: 0.85rem;"></i>
                            <span style="font-size: 0.85rem; color: var(--am-gray);">Usually responds within 1 hour</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
