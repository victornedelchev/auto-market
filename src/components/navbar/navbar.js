/**
 * Navbar component.
 * Premium dark gradient navbar with animated brand and modern navigation.
 * Auth-aware: shows Login/Sign Up for guests, Profile/Logout for authenticated users.
 */
import { getUser, getUserProfile, isAdminUser } from '../../utils/authState.js';
import { logout } from '../../services/authService.js';
import { navigateTo } from '../../utils/router.js';
import { getTheme, setTheme } from '../../utils/themeService.js';

/**
 * Render the navbar HTML.
 * @returns {string} The navbar markup.
 */
export function renderNavbar() {
    const currentHash = window.location.hash || '#/';
    const user = getUser();
    const isAdmin = isAdminUser();

    const links = [
        { href: '#/', label: 'Home', icon: 'bi-house-door' },
        { href: '#/browse', label: 'Browse', icon: 'bi-grid-3x3-gap' },
        { href: '#/create', label: 'Sell a Car', icon: 'bi-plus-circle', auth: true },
        { href: '#/favorites', label: 'Favorites', icon: 'bi-heart', auth: true },
    ];
    
    if (isAdmin) {
        links.push({ href: '#/admin', label: 'Admin Dashboard', icon: 'bi-shield-lock', auth: true });
    }

    // Filter links based on auth state
    const visibleLinks = links.filter((link) => {
        if (link.auth && !user) return false;
        return true;
    });

    const buildLink = ({ href, label, icon }) => {
        const isActive = currentHash === href ? 'active' : '';
        return `
        <li class="nav-item">
            <a class="nav-link ${isActive}" href="${href}">
                <i class="bi ${icon} me-1"></i>${label}
            </a>
        </li>`;
    };

    const authSection = user ? renderUserMenu(user) : renderGuestButtons();

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
                    ${visibleLinks.map(buildLink).join('')}
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <div class="dropdown">
                        <button class="btn btn-link p-0 text-white dropdown-toggle hide-arrow" id="theme-toggle-btn" data-bs-toggle="dropdown" style="opacity: 0.8; font-size: 1.25rem; transition: opacity 0.2s;" title="Theme Settings">
                            <i id="theme-toggle-icon" class="bi bi-circle-half"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-lg-end shadow-sm border-0" style="min-width: 140px; border-radius: 0.75rem;">
                            <li><button class="dropdown-item d-flex align-items-center theme-select-btn" data-theme-val="light"><i class="bi bi-sun me-2 text-warning"></i> Light</button></li>
                            <li><button class="dropdown-item d-flex align-items-center theme-select-btn" data-theme-val="dark"><i class="bi bi-moon-stars me-2 text-primary"></i> Dark</button></li>
                            <li><button class="dropdown-item d-flex align-items-center theme-select-btn" data-theme-val="auto"><i class="bi bi-circle-half me-2 text-secondary"></i> Auto</button></li>
                        </ul>
                    </div>
                    ${authSection}
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
        .hide-arrow::after {
            display: none !important;
        }
    </style>`;
}

/**
 * Render the guest buttons (Login + Sign Up).
 * @returns {string}
 */
function renderGuestButtons() {
    return `
    <div class="d-flex align-items-center gap-2">
        <a href="#/login" class="btn btn-sm px-3 py-2"
           style="color: rgba(255,255,255,0.8); font-weight: 500; transition: var(--am-transition-fast);">
            Login
        </a>
        <a href="#/register" class="btn btn-sm btn-am-primary px-3 py-2" style="font-size: 0.875rem;">
            <i class="bi bi-person-plus me-1"></i>Sign Up
        </a>
    </div>`;
}

/**
 * Render the authenticated user menu (Profile + Logout).
 * @param {Object} user - The Supabase user object.
 * @returns {string}
 */
function renderUserMenu(user) {
    const profile = getUserProfile();
    const displayName = profile?.full_name?.split(' ')[0]
        || user.user_metadata?.first_name
        || user.email?.split('@')[0]
        || 'User';

    const avatarHtml = profile?.avatar_url
        ? `<img src="${profile.avatar_url}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" alt="Avatar" />`
        : `<span style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: var(--am-gradient-primary);
                font-size: 0.75rem;
                color: #fff;
                font-weight: 600;
            ">${displayName.charAt(0).toUpperCase()}</span>`;

    return `
    <div class="d-flex align-items-center gap-2">
        <a href="#/profile" class="btn btn-sm px-3 py-2 d-flex align-items-center gap-2"
           style="color: rgba(255,255,255,0.8); font-weight: 500; transition: var(--am-transition-fast);">
            ${avatarHtml}
            ${displayName}
        </a>
        <button type="button" class="btn btn-sm px-3 py-2" id="logout-btn"
                style="color: rgba(255,255,255,0.7); font-weight: 500; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; transition: var(--am-transition-fast);">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
        </button>
    </div>`;
}

/**
 * Initialize navbar event listeners.
 * Must be called after renderNavbar HTML is in the DOM.
 */
export function initNavbar() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            import('bootstrap').then(({ Dropdown }) => {
                const dropdown = Dropdown.getOrCreateInstance(themeToggleBtn);
                dropdown.toggle();
            });
        });
    }

    const themeButtons = document.querySelectorAll('.theme-select-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = e.currentTarget.getAttribute('data-theme-val');
            setTheme(val);
        });
    });

    updateThemeIcon();
    
    // Listen for cross-component theme changes
    window.addEventListener('am-theme-changed', updateThemeIcon);
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    
    const theme = getTheme();
    if (theme === 'light') icon.className = 'bi bi-sun-fill';
    else if (theme === 'dark') icon.className = 'bi bi-moon-stars-fill';
    else icon.className = 'bi bi-circle-half';

    // Highlight active item in dropdown
    document.querySelectorAll('.theme-select-btn').forEach(btn => {
        if (btn.getAttribute('data-theme-val') === theme) {
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.querySelector('i').classList.replace('text-warning', 'text-white');
            btn.querySelector('i').classList.replace('text-primary', 'text-white');
            btn.querySelector('i').classList.replace('text-secondary', 'text-white');
        } else {
            btn.classList.remove('active', 'bg-primary', 'text-white');
            // reset icon colors (brute force approach for simplicity)
            const i = btn.querySelector('i');
            if (btn.getAttribute('data-theme-val') === 'light') i.className = 'bi bi-sun me-2 text-warning';
            if (btn.getAttribute('data-theme-val') === 'dark') i.className = 'bi bi-moon-stars me-2 text-primary';
            if (btn.getAttribute('data-theme-val') === 'auto') i.className = 'bi bi-circle-half me-2 text-secondary';
        }
    });
}

/**
 * Handle logout button click.
 */
async function handleLogout() {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.disabled = true;
        logoutBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Logging out...`;
    }

    await logout();
    navigateTo('/');
}
