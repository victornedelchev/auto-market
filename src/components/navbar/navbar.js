/**
 * Navbar component.
 * Premium dark gradient navbar with animated brand and modern navigation.
 */

/**
 * Render the navbar HTML.
 * @returns {string} The navbar markup.
 */
export function renderNavbar() {
    const currentHash = window.location.hash || '#/';

    const links = [
        { href: '#/', label: 'Home', icon: 'bi-house-door' },
        { href: '#/browse', label: 'Browse', icon: 'bi-grid-3x3-gap' },
        { href: '#/create', label: 'Sell a Car', icon: 'bi-plus-circle' },
        { href: '#/favorites', label: 'Favorites', icon: 'bi-heart' },
    ];

    const buildLink = ({ href, label, icon }) => {
        const isActive = currentHash === href ? 'active' : '';
        return `
        <li class="nav-item">
            <a class="nav-link ${isActive}" href="${href}">
                <i class="bi ${icon} me-1"></i>${label}
            </a>
        </li>`;
    };

    return `
    <nav class="navbar navbar-expand-lg sticky-top" style="background: var(--am-gradient-dark); border-bottom: 1px solid rgba(255,255,255,0.06);">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2" href="#/" style="text-decoration: none;">
                <span style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: var(--am-gradient-primary);
                    box-shadow: 0 4px 12px rgba(37,99,235,0.35);
                ">
                    <i class="bi bi-car-front-fill text-white" style="font-size: 1.15rem;"></i>
                </span>
                <span style="
                    font-family: var(--am-font-display);
                    font-weight: 800;
                    font-size: 1.3rem;
                    color: #fff;
                    letter-spacing: -0.02em;
                ">Auto<span style="color: var(--am-accent-light);">Market</span></span>
            </a>

            <button class="navbar-toggler border-0" type="button"
                    data-bs-toggle="collapse" data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation"
                    style="color: rgba(255,255,255,0.7);">
                <i class="bi bi-list fs-4"></i>
            </button>

            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                    ${links.map(buildLink).join('')}
                </ul>
                <div class="d-flex align-items-center gap-2">
                    <a href="#/login" class="btn btn-sm px-3 py-2"
                       style="color: rgba(255,255,255,0.8); font-weight: 500; transition: var(--am-transition-fast);"
                       onmouseover="this.style.color='#fff'"
                       onmouseout="this.style.color='rgba(255,255,255,0.8)'">
                        Login
                    </a>
                    <a href="#/register" class="btn btn-sm btn-am-primary px-3 py-2" style="font-size: 0.875rem;">
                        <i class="bi bi-person-plus me-1"></i>Sign Up
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <style>
        .navbar .nav-link {
            color: rgba(255, 255, 255, 0.65) !important;
            font-weight: 500;
            font-size: 0.9rem;
            padding: 0.5rem 1rem !important;
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        .navbar .nav-link:hover {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.08);
        }
        .navbar .nav-link.active {
            color: #fff !important;
            background: rgba(37, 99, 235, 0.25);
        }
    </style>`;
}
