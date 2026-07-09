// Import styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './styles/main.css';

// Import router
import { addRoute, setNotFound, initRouter } from './utils/router.js';

// Import auth utilities
import { initAuth, onAuthChange } from './utils/authState.js';
import { requireAuth, requireGuest } from './utils/guards.js';

// Import layout components
import { renderNavbar, initNavbar } from './components/navbar/navbar.js';
import { renderFooter } from './components/footer/footer.js';

// Import pages
import { renderHomePage } from './pages/home/home.js';
import { renderLoginPage, initLoginPage } from './pages/login/login.js';
import { renderRegisterPage, initRegisterPage } from './pages/register/register.js';
import { renderBrowsePage } from './pages/browse/browse.js';
import { renderDetailsPage, initDetailsPage } from './pages/details/details.js';
import { renderCreatePage, initCreatePage } from './pages/create/create.js';
import { renderEditPage, initEditPage } from './pages/edit/edit.js';
import { renderProfilePage, initProfilePage } from './pages/profile/profile.js';
import { renderFavoritesPage } from './pages/favorites/favorites.js';
import { renderAdminPage } from './pages/admin/admin.js';

/**
 * Render the persistent layout shell (navbar + footer).
 * Called once on app init. The router outlet sits between them.
 */
function renderLayout() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div id="navbar-container">${renderNavbar()}</div>
        <div id="router-outlet" class="flex-grow-1"></div>
        <div id="footer-container">${renderFooter()}</div>
    `;

    // Attach navbar event listeners (logout button)
    initNavbar();
}

/**
 * Re-render the navbar to reflect auth state and active route.
 */
function updateNavbar() {
    const container = document.getElementById('navbar-container');
    if (container) {
        container.innerHTML = renderNavbar();
        initNavbar();
    }
}

// ── Route Registration ──────────────────────────────────────────────────

// Public routes (accessible to everyone)
addRoute('/', renderHomePage);
addRoute('/browse', renderBrowsePage);
addRoute('/details/:id', renderDetailsPage, initDetailsPage);

// Guest-only routes (redirect to home if already logged in)
addRoute('/login', requireGuest(renderLoginPage), initLoginPage);
addRoute('/register', requireGuest(renderRegisterPage), initRegisterPage);

// Protected routes (redirect to login if not authenticated)
addRoute('/create', requireAuth(renderCreatePage), initCreatePage);
addRoute('/edit/:id', requireAuth(renderEditPage), initEditPage);
addRoute('/profile', requireAuth(renderProfilePage), initProfilePage);
addRoute('/favorites', requireAuth(renderFavoritesPage));
addRoute('/admin', requireAuth(renderAdminPage));

// 404 fallback
setNotFound(() => `
    <div class="container text-center py-5">
        <h1 class="display-1 fw-bold text-secondary">404</h1>
        <p class="lead">Page not found.</p>
        <a href="#/" class="btn btn-primary">Go Home</a>
    </div>
`);

// ── Auth State Listener ─────────────────────────────────────────────────

// Re-render navbar whenever auth state changes (login / logout / token refresh)
onAuthChange(() => {
    updateNavbar();
});

// Update navbar active state on every navigation
window.addEventListener('hashchange', updateNavbar);

// ── Initialize ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    // Restore session before rendering anything
    await initAuth();

    renderLayout();
    initRouter();
});

console.log('AutoMarket AI initialized!');
