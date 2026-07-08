/**
 * Register page.
 * Premium registration card with gradient header.
 */

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
                <form id="register-form">
                    <div class="row g-3">
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
                        <label for="register-password" class="form-label">Password</label>
                        <div class="input-group">
                            <span class="input-group-text" style="background: var(--am-light); border-right: none; border-radius: var(--am-radius-sm) 0 0 var(--am-radius-sm); color: var(--am-gray);">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input type="password" class="form-control" id="register-password" placeholder="Min 6 characters" required
                                   style="border-left: none; border-radius: 0 var(--am-radius-sm) var(--am-radius-sm) 0;" />
                        </div>
                        <div class="d-flex gap-1 mt-2">
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
                            <input type="password" class="form-control" id="register-confirm-password" placeholder="Repeat password" required
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
                        <button type="submit" class="btn btn-am-primary py-2" style="font-size: 1rem;">
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
