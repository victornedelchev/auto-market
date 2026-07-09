/**
 * Login page.
 * Premium auth card with gradient header and styled form.
 * Integrates with Supabase Auth for email/password sign-in.
 */
import { login } from '../../services/authService.js';
import { navigateTo } from '../../utils/router.js';
import { showToast } from '../../utils/toastService.js';

/**
 * Render the login page.
 * @returns {string} The page markup.
 */
export function renderLoginPage() {
    return `
    <div class="container py-5">
        <div class="auth-card">
            <div class="auth-header">
                <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.15);">
                    <i class="bi bi-box-arrow-in-right" style="font-size: 1.5rem;"></i>
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to your AutoMarket account</p>
            </div>
            <div class="auth-body">
                <form id="login-form" novalidate>
                    <div class="mb-3">
                        <label for="login-email" class="form-label">Email address</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-envelope"></i>
                            </span>
                            <input type="email" class="form-control" id="login-email" placeholder="you@example.com" required
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                        <div class="invalid-feedback">Please enter a valid email address.</div>
                    </div>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <label for="login-password" class="form-label">Password</label>
                            <a href="#" style="font-size: 0.82rem; color: var(--am-primary); text-decoration: none; font-weight: 500;">Forgot password?</a>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input type="password" class="form-control" id="login-password" placeholder="Enter your password" required minlength="6"
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                        <div class="invalid-feedback">Password must be at least 6 characters.</div>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="login-remember">
                        <label class="form-check-label" for="login-remember" style="font-size: 0.875rem; color: var(--am-gray);">
                            Remember me
                        </label>
                    </div>
                    <div class="d-grid mb-3">
                        <button type="submit" class="btn btn-am-primary py-2" id="login-submit-btn" style="font-size: 1rem;">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                        </button>
                    </div>
                    <div class="auth-divider">or</div>
                    <p class="text-center" style="font-size: 0.9rem; color: var(--am-gray);">
                        Don't have an account? <a href="#/register" style="color: var(--am-primary); font-weight: 600; text-decoration: none;">Create one</a>
                    </p>
                </form>
            </div>
        </div>
    </div>`;
}

/**
 * Initialize login page event listeners.
 * Must be called after renderLoginPage HTML is in the DOM.
 */
export function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.reset();

    form.addEventListener('submit', handleLoginSubmit);
}

/**
 * Handle login form submission.
 * @param {SubmitEvent} e
 */
async function handleLoginSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('login-submit-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    // Client-side validation
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        showToast('Please enter your email address.', 'danger');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'danger');
        emailInput.focus();
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'danger');
        passwordInput.focus();
        return;
    }

    // Disable button and show spinner
    setLoading(submitBtn, true);

    try {
        const { data, error } = await login(email, password);

        if (error) {
            showToast(error.message || 'Login failed. Please try again.', 'danger');
            setLoading(submitBtn, false);
            return;
        }

        // Wait a tiny bit for authState to update, then check if profile is active
        const { getProfile } = await import('../../services/profileService.js');
        const { data: profile } = await getProfile(data.session.user.id);
        
        if (profile && profile.is_active === false) {
            const { logout } = await import('../../services/authService.js');
            await logout();
            showToast('Your account has been deactivated. Please contact support.', 'danger');
            setLoading(submitBtn, false);
            return;
        }

        // Login is obvious, so we just redirect without a toast
        emailInput.value = '';
        passwordInput.value = '';
        const rememberCheckbox = document.getElementById('login-remember');
        if (rememberCheckbox) rememberCheckbox.checked = false;
        document.getElementById('login-form').reset();
        setTimeout(() => {
            navigateTo('/');
        }, 300);
    } catch (err) {
        showToast('An unexpected error occurred. Please try again.', 'danger');
        setLoading(submitBtn, false);
    }
}



/**
 * Toggle loading state on a button.
 * @param {HTMLElement} btn
 * @param {boolean} loading
 */
function setLoading(btn, loading) {
    if (loading) {
        btn.disabled = true;
        btn.dataset.originalHtml = btn.innerHTML;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...`;
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalHtml || '<i class="bi bi-box-arrow-in-right me-2"></i>Sign In';
    }
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
