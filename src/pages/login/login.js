/**
 * Login page.
 * Premium auth card with gradient header and styled form.
 */

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
                <form id="login-form">
                    <div class="mb-3">
                        <label for="login-email" class="form-label">Email address</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-envelope"></i>
                            </span>
                            <input type="email" class="form-control" id="login-email" placeholder="you@example.com" required
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
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
                            <input type="password" class="form-control" id="login-password" placeholder="Enter your password" required
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="login-remember">
                        <label class="form-check-label" for="login-remember" style="font-size: 0.875rem; color: var(--am-gray);">
                            Remember me
                        </label>
                    </div>
                    <div class="d-grid mb-3">
                        <button type="submit" class="btn btn-am-primary py-2" style="font-size: 1rem;">
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
