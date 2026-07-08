/**
 * Simple hash-based client-side router.
 * Routes are registered as { path, handler } objects.
 * The handler receives any route parameters extracted from the URL.
 */

const routes = [];
let notFoundHandler = null;

/**
 * Register a route.
 * Supports dynamic segments like `/details/:id`.
 * @param {string} path - The route path pattern.
 * @param {Function} handler - Async function that returns HTML or renders into the outlet.
 */
export function addRoute(path, handler) {
    routes.push({ path, handler });
}

/**
 * Register a fallback handler for unmatched routes.
 * @param {Function} handler
 */
export function setNotFound(handler) {
    notFoundHandler = handler;
}

/**
 * Navigate programmatically.
 * @param {string} path - The hash path to navigate to (without `#`).
 */
export function navigateTo(path) {
    window.location.hash = `#${path}`;
}

/**
 * Match a registered route pattern against the current hash path.
 * Returns `{ handler, params }` or `null`.
 */
function matchRoute(hash) {
    const currentPath = hash.replace('#', '') || '/';

    for (const route of routes) {
        const paramNames = [];
        const regexStr = route.path.replace(/:([^/]+)/g, (_match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });

        const regex = new RegExp(`^${regexStr}$`);
        const match = currentPath.match(regex);

        if (match) {
            const params = {};
            paramNames.forEach((name, index) => {
                params[name] = match[index + 1];
            });
            return { handler: route.handler, params };
        }
    }

    return null;
}

/**
 * Resolve the current hash and render the matching page into the outlet element.
 */
async function resolveRoute() {
    const outlet = document.getElementById('router-outlet');
    if (!outlet) return;

    const hash = window.location.hash || '#/';
    const result = matchRoute(hash);

    if (result) {
        const content = await result.handler(result.params);
        if (typeof content === 'string') {
            outlet.innerHTML = content;
        }
    } else if (notFoundHandler) {
        const content = await notFoundHandler();
        if (typeof content === 'string') {
            outlet.innerHTML = content;
        }
    }
}

/**
 * Initialize the router — listen for hash changes and resolve the initial route.
 */
export function initRouter() {
    window.addEventListener('hashchange', resolveRoute);
    resolveRoute();
}
