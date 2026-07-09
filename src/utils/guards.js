/**
 * Route Guards.
 * Higher-order functions that wrap page handlers to enforce auth requirements.
 * Used when registering routes in main.js.
 */
import { isAuthenticated } from './authState.js';
import { navigateTo } from './router.js';

/**
 * Guard that requires the user to be authenticated.
 * If the user is not logged in, they are redirected to the login page.
 *
 * @param {Function} handler - The page render function to protect.
 * @returns {Function} A wrapped handler that checks auth before rendering.
 *
 * @example
 *   addRoute('/create', requireAuth(renderCreatePage));
 */
export function requireAuth(handler) {
  return async (params) => {
    if (!isAuthenticated()) {
      navigateTo('/login');
      return '';
    }
    return handler(params);
  };
}

/**
 * Guard that requires the user to be a guest (not authenticated).
 * If the user is already logged in, they are redirected to the home page.
 *
 * @param {Function} handler - The page render function to protect.
 * @returns {Function} A wrapped handler that checks guest status before rendering.
 *
 * @example
 *   addRoute('/login', requireGuest(renderLoginPage));
 */
export function requireGuest(handler) {
  return async (params) => {
    if (isAuthenticated()) {
      navigateTo('/');
      return '';
    }
    return handler(params);
  };
}

/**
 * Guard that requires the user to be an admin.
 */
export function requireAdmin(handler) {
  return async (params) => {
    if (!isAuthenticated()) {
      navigateTo('/login');
      return '';
    }
    
    // Check if admin
    const { getUser } = await import('./authState.js');
    const { checkIsAdmin } = await import('../services/adminService.js');
    const user = getUser();
    
    if (!user || !(await checkIsAdmin(user.id))) {
      const { showToast } = await import('./toastService.js');
      showToast('Access Denied. Admins only.', 'danger');
      navigateTo('/');
      return '';
    }
    
    return handler(params);
  };
}
