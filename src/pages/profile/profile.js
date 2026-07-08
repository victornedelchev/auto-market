/**
 * Profile page.
 * Premium profile with avatar, stats, and user's listings.
 */
import { renderListingCard } from '../../components/listingCard/listingCard.js';

/**
 * Render the profile page.
 * @returns {string} The page markup.
 */
export function renderProfilePage() {
    const placeholderListings = [
        { id: '1', title: 'BMW X5 M Sport', price: 45000, year: 2022, fuel: 'Diesel', mileage: 32000 },
        { id: '2', title: 'Mercedes-Benz C220d', price: 38500, year: 2021, fuel: 'Diesel', mileage: 41000 },
    ];

    return `
    <!-- Profile Header -->
    <div style="background: var(--am-gradient-hero); padding: 3rem 0 5rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -60px; right: -40px; width: 250px; height: 250px; border-radius: 50%; background: rgba(37,99,235,0.08);"></div>
        <div class="container position-relative">
            <div class="d-flex align-items-center gap-4 flex-wrap">
                <!-- Avatar -->
                <div style="width: 90px; height: 90px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--am-font-display); font-weight: 800; font-size: 2rem; border: 4px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(37,99,235,0.3);">
                    JD
                </div>
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff; margin: 0;">John Doe</h1>
                    <p style="color: rgba(255,255,255,0.5); margin: 0.25rem 0 0.5rem;">
                        <i class="bi bi-envelope me-1"></i>john.doe@example.com
                    </p>
                    <div class="d-flex gap-2 align-items-center">
                        <span class="badge-am badge-am-success" style="font-size: 0.75rem;">
                            <i class="bi bi-patch-check-fill me-1"></i>Verified
                        </span>
                        <span style="color: rgba(255,255,255,0.4); font-size: 0.82rem;">
                            <i class="bi bi-clock me-1"></i>Member since Jan 2023
                        </span>
                    </div>
                </div>
                <div class="ms-auto d-none d-md-block">
                    <button class="btn btn-am-ghost">
                        <i class="bi bi-pencil me-1"></i>Edit Profile
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Cards (overlapping) -->
    <div class="container" style="margin-top: -2.5rem; position: relative; z-index: 2;">
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="stat-card card-am-static">
                    <div class="stat-icon" style="background: var(--am-primary-100); color: var(--am-primary);">
                        <i class="bi bi-card-list"></i>
                    </div>
                    <div class="stat-value" style="color: var(--am-primary);">2</div>
                    <div class="stat-label">Active Listings</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card card-am-static">
                    <div class="stat-icon" style="background: #fee2e2; color: var(--am-danger);">
                        <i class="bi bi-heart-fill"></i>
                    </div>
                    <div class="stat-value" style="color: var(--am-danger);">5</div>
                    <div class="stat-label">Favorites</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card card-am-static">
                    <div class="stat-icon" style="background: #d1fae5; color: var(--am-success);">
                        <i class="bi bi-eye"></i>
                    </div>
                    <div class="stat-value" style="color: var(--am-success);">120</div>
                    <div class="stat-label">Profile Views</div>
                </div>
            </div>
        </div>

        <!-- User Listings -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="section-header mb-0">
                <div class="section-icon"><i class="bi bi-grid-3x3-gap-fill"></i></div>
                <div>
                    <h2 style="font-size: 1.4rem;">My Listings</h2>
                    <span class="section-subtitle">Cars you currently have for sale</span>
                </div>
            </div>
            <a href="#/create" class="btn btn-am-primary btn-sm">
                <i class="bi bi-plus-lg me-1"></i>New Listing
            </a>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            ${placeholderListings.map(l => renderListingCard(l)).join('')}
        </div>
    </div>`;
}
