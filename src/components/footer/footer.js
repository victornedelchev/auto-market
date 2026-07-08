/**
 * Footer component.
 * Modern dark footer with gradient accent line, brand, links and social icons.
 */

/**
 * Render the footer HTML.
 * @returns {string} The footer markup.
 */
export function renderFooter() {
    const year = new Date().getFullYear();

    return `
    <footer style="background: var(--am-gradient-dark); border-top: 3px solid var(--am-primary);" class="text-light pt-5 pb-4 mt-auto">
        <div class="container">
            <div class="row g-4 mb-4">
                <!-- Brand Column -->
                <div class="col-lg-4 mb-3 mb-lg-0">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <span style="
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 38px;
                            height: 38px;
                            border-radius: 10px;
                            background: var(--am-gradient-primary);
                        ">
                            <i class="bi bi-car-front-fill text-white"></i>
                        </span>
                        <span style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.2rem;">
                            Auto<span style="color: var(--am-accent-light);">Market</span>
                        </span>
                    </div>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; line-height: 1.7; max-width: 300px;">
                        Your premium car marketplace powered by AI. Find, sell, and manage car listings with ease.
                    </p>
                    <div class="d-flex gap-2 mt-3">
                        <a href="#" class="footer-social-btn"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="footer-social-btn"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="footer-social-btn"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="footer-social-btn"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="col-6 col-lg-2">
                    <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                        Marketplace
                    </h6>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#/browse"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Browse Cars</a></li>
                        <li><a href="#/create"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Sell a Car</a></li>
                        <li><a href="#/favorites"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Favorites</a></li>
                    </ul>
                </div>

                <!-- Account -->
                <div class="col-6 col-lg-2">
                    <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                        Account
                    </h6>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#/login"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Login</a></li>
                        <li><a href="#/register"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Register</a></li>
                        <li><a href="#/profile"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>My Profile</a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="col-lg-4">
                    <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                        Stay Updated
                    </h6>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">
                        Subscribe to get the latest listings and deals.
                    </p>
                    <div class="input-group" style="max-width: 340px;">
                        <input type="email" class="form-control" placeholder="your@email.com"
                               style="border-radius: 8px 0 0 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff;">
                        <button class="btn btn-am-primary" style="border-radius: 0 8px 8px 0; padding: 0 1.2rem;">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                </div>
            </div>

            <hr style="border-color: rgba(255,255,255,0.08);" />

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                <p style="color: rgba(255,255,255,0.35); font-size: 0.82rem; margin: 0;">
                    &copy; ${year} AutoMarket AI. All rights reserved.
                </p>
                <div class="d-flex gap-3">
                    <a href="#" style="color: rgba(255,255,255,0.35); font-size: 0.82rem; text-decoration: none;">Privacy Policy</a>
                    <a href="#" style="color: rgba(255,255,255,0.35); font-size: 0.82rem; text-decoration: none;">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <style>
        .footer-links li {
            margin-bottom: 0.6rem;
        }
        .footer-links a {
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
        }
        .footer-links a:hover {
            color: var(--am-accent-light);
            padding-left: 4px;
        }
        .footer-social-btn {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }
        .footer-social-btn:hover {
            background: var(--am-primary);
            color: #fff;
            border-color: var(--am-primary);
            transform: translateY(-2px);
        }
    </style>`;
}
