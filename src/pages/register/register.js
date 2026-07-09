/**
 * Register page.
 * Premium registration card with gradient header.
 * Integrates with Supabase Auth for email/password sign-up.
 */
import { register } from '../../services/authService.js';
import { navigateTo } from '../../utils/router.js';

/**
 * Render the register page.
 * @returns {string} The page markup.
 */
export function renderRegisterPage() {
    return `
    <div class="container py-5">
        <div class="auth-card" style="max-width: 520px;">
            <div class="auth-header">
                <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.15);">
                    <i class="bi bi-person-plus" style="font-size: 1.5rem;"></i>
                </div>
                <h2>Create Account</h2>
                <p>Join the AutoMarket community today</p>
            </div>
            <div class="auth-body">
                <div id="register-alert"></div>
                <form id="register-form" novalidate>
                    <div class="row g-3">
                        <div class="col-12">
                            <label for="register-username" class="form-label">Username *</label>
                            <div class="input-group">
                                <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                    <i class="bi bi-at"></i>
                                </span>
                                <input type="text" class="form-control" id="register-username" placeholder="johndoe123" required
                                       style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                            </div>
                        </div>
                        <div class="col-6">
                            <label for="register-first-name" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="register-first-name" placeholder="John" required />
                        </div>
                        <div class="col-6">
                            <label for="register-last-name" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="register-last-name" placeholder="Doe" required />
                        </div>
                    </div>
                    <div class="mb-3 mt-3">
                        <label for="register-email" class="form-label">Email address</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-envelope"></i>
                            </span>
                            <input type="email" class="form-control" id="register-email" placeholder="you@example.com" required
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="register-phone" class="form-label">Phone Number (optional)</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-telephone"></i>
                            </span>
                            <input type="tel" class="form-control" id="register-phone" placeholder="+1 234 567 890"
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="register-password" class="form-label">Password</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input type="password" class="form-control" id="register-password" placeholder="Min 6 characters" required minlength="6"
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                        <div class="d-flex gap-1 mt-2" id="password-strength-bars">
                            <div style="flex: 1; height: 3px; border-radius: 2px; background: #e2e8f0;"></div>
                            <div style="flex: 1; height: 3px; border-radius: 2px; background: #e2e8f0;"></div>
                            <div style="flex: 1; height: 3px; border-radius: 2px; background: #e2e8f0;"></div>
                            <div style="flex: 1; height: 3px; border-radius: 2px; background: #e2e8f0;"></div>
                        </div>
                        <small style="color: var(--am-gray-light); font-size: 0.78rem;">Use at least 6 characters with letters and numbers</small>
                    </div>
                    <div class="mb-3">
                        <label for="register-confirm-password" class="form-label">Confirm Password</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-lock-fill"></i>
                            </span>
                            <input type="password" class="form-control" id="register-confirm-password" placeholder="Repeat password" required minlength="6"
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="register-terms" required>
                        <label class="form-check-label" for="register-terms" style="font-size: 0.85rem; color: var(--am-gray);">
                            I agree to the <a href="#" style="color: var(--am-primary); text-decoration: none; font-weight: 500;">Terms of Service</a>
                            and <a href="#" style="color: var(--am-primary); text-decoration: none; font-weight: 500;">Privacy Policy</a>
                        </label>
                    </div>
                    <div class="d-grid mb-3">
                        <button type="submit" class="btn btn-am-primary py-2" id="register-submit-btn" style="font-size: 1rem;">
                            <i class="bi bi-person-plus me-2"></i>Create Account
                        </button>
                    </div>
                    <div class="auth-divider">or</div>
                    <p class="text-center" style="font-size: 0.9rem; color: var(--am-gray);">
                        Already have an account? <a href="#/login" style="color: var(--am-primary); font-weight: 600; text-decoration: none;">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    </div>`;
}

/**
 * Initialize register page event listeners.
 * Must be called after renderRegisterPage HTML is in the DOM.
 */
export function initRegisterPage() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', handleRegisterSubmit);

    // Live password strength indicator
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

/**
 * Handle register form submission.
 * @param {SubmitEvent} e
 */
async function handleRegisterSubmit(e) {
    e.preventDefault();

    const alertBox = document.getElementById('register-alert');
    const submitBtn = document.getElementById('register-submit-btn');
    const usernameInput = document.getElementById('register-username');
    const firstNameInput = document.getElementById('register-first-name');
    const lastNameInput = document.getElementById('register-last-name');
    const emailInput = document.getElementById('register-email');
    const phoneInput = document.getElementById('register-phone');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const termsCheckbox = document.getElementById('register-terms');

    // Clear previous alerts
    alertBox.innerHTML = '';

    // Gather values
    const username = usernameInput ? usernameInput.value.trim() : '';
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Client-side validation
    if (!username) {
        showAlert(alertBox, 'danger', 'Please enter a username.');
        if (usernameInput) usernameInput.focus();
        return;
    }

    if (!firstName || !lastName) {
        showAlert(alertBox, 'danger', 'Please enter your first and last name.');
        firstNameInput.focus();
        return;
    }

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

    if (password !== confirmPassword) {
        showAlert(alertBox, 'warning', 'Passwords do not match. Please try again.');
        confirmPasswordInput.focus();
        return;
    }

    if (!termsCheckbox.checked) {
        showAlert(alertBox, 'warning', 'You must agree to the Terms of Service and Privacy Policy.');
        return;
    }

    // Disable button and show spinner
    setLoading(submitBtn, true);

    try {
        const { error } = await register(email, password, {
            username: username,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
        });

        if (error) {
            showAlert(alertBox, 'danger', error.message || 'Registration failed. Please try again.');
            setLoading(submitBtn, false);
            return;
        }

        showAlert(alertBox, 'success',
            'Account created successfully! Redirecting to login...');

        // Redirect to login after a short delay
        setTimeout(() => {
            navigateTo('/login');
        }, 2500);
    } catch (err) {
        showAlert(alertBox, 'danger', 'An unexpected error occurred. Please try again.');
        setLoading(submitBtn, false);
    }
}

/**
 * Update the password strength indicator bars.
 */
function updatePasswordStrength() {
    const password = document.getElementById('register-password').value;
    const bars = document.querySelectorAll('#password-strength-bars > div');

    const strength = calculateStrength(password);
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#16a34a'];

    bars.forEach((bar, i) => {
        bar.style.background = i < strength ? colors[Math.min(strength - 1, 3)] : '#e2e8f0';
    });
}

/**
 * Calculate password strength (0–4).
 * @param {string} password
 * @returns {number}
 */
function calculateStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
    return score;
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
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating account...`;
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalHtml || '<i class="bi bi-person-plus me-2"></i>Create Account';
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
