/**
 * Home page.
 * Premium landing with gradient hero, floating badges, featured listings, stats, and how-it-works.
 */
import { renderListingCard } from '../../components/listingCard/listingCard.js';

/**
 * Render the home page.
 * @returns {string} The page markup.
 */
export function renderHomePage() {


    return `
    <!-- ── Hero Section ── -->
    <section style="background: var(--am-gradient-hero); position: relative; overflow: hidden; padding: 5rem 0 4rem;">
        <!-- Decorative circles -->
        <div class="anim-zoom-in" style="position: absolute; top: -80px; right: -60px; width: 300px; height: 300px; border-radius: 50%; background: rgba(37,99,235,0.08);"></div>
        <div class="anim-zoom-in delay-200" style="position: absolute; bottom: -100px; left: -80px; width: 350px; height: 350px; border-radius: 50%; background: rgba(245,158,11,0.06);"></div>

        <div class="container position-relative">
            <div class="row align-items-center">
                <div class="col-lg-7">
                    <div class="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 anim-slide-up" style="background: rgba(37,99,235,0.15); border-radius: 99px; border: 1px solid rgba(37,99,235,0.25);">
                        <span class="pulse-dot"></span>
                        <span style="color: var(--am-primary-200); font-size: 0.85rem; font-weight: 500;">1,200+ live listings</span>
                    </div>

                    <h1 class="anim-slide-up delay-100" style="font-family: var(--am-font-display); font-weight: 900; font-size: clamp(2.2rem, 5vw, 3.5rem); color: #fff; line-height: 1.1; margin-bottom: 1.25rem;">
                        Find Your Next<br>
                        <span style="background: linear-gradient(135deg, var(--am-accent-light), #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Dream Car</span>
                    </h1>

                    <p class="anim-slide-up delay-200" style="color: rgba(255,255,255,0.6); font-size: 1.1rem; max-width: 500px; line-height: 1.7; margin-bottom: 2rem;">
                        Browse thousands of verified listings, sell with AI-powered tools, and get the best deal on your next vehicle.
                    </p>

                    <div class="d-flex gap-3 flex-wrap anim-slide-up delay-300">
                        <a href="#/browse" class="btn btn-am-primary btn-lg px-4 hover-glow">
                            <i class="bi bi-search me-2"></i>Browse Cars
                        </a>
                        <a href="#/create" class="btn btn-am-ghost btn-lg px-4 hover-glow">
                            <i class="bi bi-plus-lg me-2"></i>Sell Your Car
                        </a>
                    </div>

                    <!-- Trust badges -->
                    <div class="d-flex gap-4 mt-4 flex-wrap anim-slide-up delay-400">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-shield-check" style="color: var(--am-success); font-size: 1.1rem;"></i>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">Verified Sellers</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-lightning-charge" style="color: var(--am-accent-light); font-size: 1.1rem;"></i>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">Instant Listing</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-stars" style="color: var(--am-info); font-size: 1.1rem;"></i>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">AI Powered</span>
                        </div>
                    </div>
                </div>

                <!-- Hero Stats Panel -->
                <div class="col-lg-5 d-none d-lg-block anim-zoom-in delay-200">
                    <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--am-radius-lg); padding: 2rem;" class="hover-glow">
                        <div class="row g-3">
                            <div class="col-6">
                                <div style="background: rgba(37,99,235,0.12); border-radius: var(--am-radius); padding: 1.25rem; text-align: center;">
                                    <div style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff;">1.2K+</div>
                                    <div style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Active Listings</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="background: rgba(245,158,11,0.12); border-radius: var(--am-radius); padding: 1.25rem; text-align: center;">
                                    <div style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff;">5K+</div>
                                    <div style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Happy Users</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="background: rgba(16,185,129,0.12); border-radius: var(--am-radius); padding: 1.25rem; text-align: center;">
                                    <div style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff;">98%</div>
                                    <div style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Satisfaction</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="background: rgba(6,182,212,0.12); border-radius: var(--am-radius); padding: 1.25rem; text-align: center;">
                                    <div style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff;">24/7</div>
                                    <div style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ── Featured Listings ── -->
    <section class="container" style="margin-top: -2rem; position: relative; z-index: 2;">
        <div class="card-am-static p-4 animate-on-scroll">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="section-header mb-0">
                    <div class="section-icon"><i class="bi bi-star-fill"></i></div>
                    <div>
                        <h2 style="font-size: 1.4rem;">Featured Listings</h2>
                        <span class="section-subtitle">Hand-picked cars just for you</span>
                    </div>
                </div>
                <a href="#/browse" class="btn btn-am-outline btn-sm d-none d-md-inline-flex">
                    View All <i class="bi bi-arrow-right ms-1"></i>
                </a>
            </div>
            <div id="home-featured-listings" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- ── How It Works ── -->
    <section class="container py-5">
        <div class="text-center mb-5 animate-on-scroll">
            <h2 style="font-family: var(--am-font-display); font-weight: 800; font-size: 2rem;">
                How It <span class="text-gradient">Works</span>
            </h2>
            <p style="color: var(--am-gray); max-width: 500px; margin: 0.5rem auto 0;">
                Three simple steps to buy or sell your car on AutoMarket AI.
            </p>
        </div>
        <div class="row g-4">
            <div class="col-md-4 animate-on-scroll delay-100">
                <div class="card-am-static text-center p-4 h-100 hover-lift">
                    <div style="width: 64px; height: 64px; border-radius: 16px; background: var(--am-primary-100); color: var(--am-primary); display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1rem;">
                        <i class="bi bi-search-heart"></i>
                    </div>
                    <h5 style="font-family: var(--am-font-display); font-weight: 700;">Browse & Search</h5>
                    <p style="color: var(--am-gray); font-size: 0.9rem;">
                        Use powerful filters to find exactly what you're looking for among thousands of listings.
                    </p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll delay-200">
                <div class="card-am-static text-center p-4 h-100 hover-lift">
                    <div style="width: 64px; height: 64px; border-radius: 16px; background: #fef3c7; color: var(--am-accent-dark); display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1rem;">
                        <i class="bi bi-chat-dots"></i>
                    </div>
                    <h5 style="font-family: var(--am-font-display); font-weight: 700;">Connect & Negotiate</h5>
                    <p style="color: var(--am-gray); font-size: 0.9rem;">
                        Contact sellers directly, ask questions, and negotiate the best price for your dream car.
                    </p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll delay-300">
                <div class="card-am-static text-center p-4 h-100 hover-lift">
                    <div style="width: 64px; height: 64px; border-radius: 16px; background: #d1fae5; color: var(--am-success); display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1rem;">
                        <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                    <h5 style="font-family: var(--am-font-display); font-weight: 700;">Close the Deal</h5>
                    <p style="color: var(--am-gray); font-size: 0.9rem;">
                        Meet the seller, inspect the vehicle, and drive away in your new car with confidence.
                    </p>
                </div>
            </div>
        </div>
    </section>`;
}

/**
 * Initialize the home page (fetch random featured listings).
 */
export async function initHomePage() {
    const container = document.getElementById('home-featured-listings');
    if (!container) return;

    // Attach event listener for favorite buttons
    container.addEventListener('click', async (e) => {
        const btn = e.target.closest('.favorite-btn');
        if (!btn) return;

        const { getUser } = await import('../../utils/authState.js');
        const user = getUser();
        if (!user) {
            const { showToast } = await import('../../utils/toastService.js');
            const { navigateTo } = await import('../../utils/router.js');
            showToast('Please log in to add favorites.', 'warning');
            navigateTo('/login');
            return;
        }

        const listingId = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const isCurrentlyFavorite = icon.classList.contains('bi-heart-fill');

        try {
            const { addFavorite, removeFavorite } = await import('../../services/listingService.js');
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
            const { showToast } = await import('../../utils/toastService.js');
            showToast('Failed to update favorites.', 'error');
        }
    });

    try {
        const { getListings, getFavorites } = await import('../../services/listingService.js');
        const { getListingImageUrls } = await import('../../services/storageService.js');
        const { getUser } = await import('../../utils/authState.js');

        // Fetch up to 50 latest listings to pick randomly from
        const { data: listings, error } = await getListings({ limit: 50 });
        if (error) throw error;

        if (!listings || listings.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-5">No listings available.</div>';
            return;
        }

        // Fetch favorites for current user to mark them in the UI
        let userFavoriteIds = new Set();
        const user = getUser();
        if (user) {
            const { data: favorites } = await getFavorites(user.id);
            if (favorites) {
                userFavoriteIds = new Set(favorites.map(f => f.listing_id));
            }
        }

        // Shuffle and pick 3
        const shuffled = [...listings].sort(() => 0.5 - Math.random());
        const selectedListings = shuffled.slice(0, 3);

        const listingsWithImages = await Promise.all(selectedListings.map(async (listing) => {
            const { urls } = await getListingImageUrls(listing.id);
            listing.coverUrl = (urls && urls.length > 0) 
                ? urls[0] 
                : 'https://dummyimage.com/600x400/e2e8f0/64748b&text=No+Image';
            listing.isFavorite = userFavoriteIds.has(listing.id);
            return listing;
        }));

        container.innerHTML = listingsWithImages.map(l => renderListingCard({
            ...l,
            image: l.coverUrl,
            fuel: l.fuel_type
        })).join('');

        const { initScrollAnimations } = await import('../../utils/animations.js');
        initScrollAnimations();

    } catch (err) {
        console.error('Failed to load featured listings:', err);
        container.innerHTML = '<div class="col-12 text-center text-danger py-5">Failed to load featured listings.</div>';
    }
}
