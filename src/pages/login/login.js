/**
 * Login page.
 * Premium auth card with gradient header and styled form.
 * Integrates with Supabase Auth for email/password sign-in.
 */
import { login } from '../../services/authService.js';
import { navigateTo } from '../../utils/router.js';

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
                <div id="login-alert"></div>
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

    form.addEventListener('submit', handleLoginSubmit);
}

/**
 * Handle login form submission.
 * @param {SubmitEvent} e
 */
async function handleLoginSubmit(e) {
    e.preventDefault();

    const alertBox = document.getElementById('login-alert');
    const submitBtn = document.getElementById('login-submit-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    // Clear previous alerts
    alertBox.innerHTML = '';

    // Client-side validation
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        showAlert(alertBox, 'danger', 'Please enter your email address.');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showAlert(alertBox, 'danger', 'Please enter a valid email address.');
        emailInput.focus();
        return;
    }

    if (password.length < 6) {
        showAlert(alertBox, 'danger', 'Password must be at least 6 characters.');
        passwordInput.focus();
        return;
    }

    // Disable button and show spinner
    setLoading(submitBtn, true);

    try {
        const { error } = await login(email, password);

        if (error) {
            showAlert(alertBox, 'danger', error.message || 'Login failed. Please try again.');
            setLoading(submitBtn, false);
            return;
        }

        showAlert(alertBox, 'success', 'Login successful! Redirecting...');

        // Short delay so the user sees the success message
        setTimeout(() => {
            navigateTo('/');
        }, 800);
    } catch (err) {
        showAlert(alertBox, 'danger', 'An unexpected error occurred. Please try again.');
        setLoading(submitBtn, false);
    }
}

/**
 * Display a Bootstrap alert in the given container.
 * @param {HTMLElement} container
 * @param {'success'|'danger'|'warning'|'info'} type
 * @param {string} message
 */
function showAlert(container, type, message) {
    const icon = type === 'success' ? 'bi-check-circle-fill'
        : type === 'danger' ? 'bi-exclamation-triangle-fill'
        : type === 'warning' ? 'bi-exclamation-circle-fill'
        : 'bi-info-circle-fill';

    container.innerHTML = `
        <div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show" role="alert">
            <i class="bi ${icon} me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
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
