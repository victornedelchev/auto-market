// Import styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './styles/main.css';

// Import router
import { addRoute, setNotFound, initRouter } from './utils/router.js';

// Import layout components
import { renderNavbar } from './components/navbar/navbar.js';
import { renderFooter } from './components/footer/footer.js';

// Import pages
import { renderHomePage } from './pages/home/home.js';
import { renderLoginPage } from './pages/login/login.js';
import { renderRegisterPage } from './pages/register/register.js';
import { renderBrowsePage } from './pages/browse/browse.js';
import { renderDetailsPage } from './pages/details/details.js';
import { renderCreatePage } from './pages/create/create.js';
import { renderEditPage } from './pages/edit/edit.js';
import { renderProfilePage } from './pages/profile/profile.js';
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
}

/**
 * Re-render the navbar to reflect the currently active route.
 */
function updateNavbar() {
    const container = document.getElementById('navbar-container');
    if (container) {
        container.innerHTML = renderNavbar();
    }
}

// Register all routes
addRoute('/', renderHomePage);
addRoute('/login', renderLoginPage);
addRoute('/register', renderRegisterPage);
addRoute('/browse', renderBrowsePage);
addRoute('/details/:id', renderDetailsPage);
addRoute('/create', renderCreatePage);
addRoute('/edit/:id', renderEditPage);
addRoute('/profile', renderProfilePage);
addRoute('/favorites', renderFavoritesPage);
addRoute('/admin', renderAdminPage);

// 404 fallback
setNotFound(() => `
    <div class="container text-center py-5">
        <h1 class="display-1 fw-bold text-secondary">404</h1>
        <p class="lead">Page not found.</p>
        <a href="#/" class="btn btn-primary">Go Home</a>
    </div>
`);

// Update navbar active state on every navigation
window.addEventListener('hashchange', updateNavbar);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderLayout();
    initRouter();
});

console.log('AutoMarket AI initialized!');
