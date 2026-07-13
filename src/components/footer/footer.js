/**
 * Footer component.
 * Modern dark footer with gradient accent line, brand, links and social icons.
 */

import { showToast } from '../../utils/toastService.js';
import { Modal } from 'bootstrap';
import { showLegalModal } from '../../utils/modalService.js';

/**
 * Render the footer HTML.
 * @returns {string} The footer markup.
 */
export function renderFooter() {
    const year = new Date().getFullYear();

    return `
    <footer style="background: var(--am-gradient-dark); border-top: 3px solid var(--am-primary);" class="text-light pt-5 pb-4 mt-auto">
        <div class="container">
            <div class="row g-4 mb-4">
                <!-- Brand Column -->
                <div class="col-lg-4 mb-3 mb-lg-0">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <span style="
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 38px;
                            height: 38px;
                            border-radius: 10px;
                            background: var(--am-gradient-primary);
                        ">
                            <i class="bi bi-car-front-fill text-white"></i>
                        </span>
                        <span style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.2rem;">
                            Auto<span style="color: var(--am-accent-light);">Market</span>
                        </span>
                    </div>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; line-height: 1.7; max-width: 300px;">
                        Your premium car marketplace powered by AI. Find, sell, and manage car listings with ease.
                    </p>
                    <div class="d-flex gap-2 mt-3">
                        <a href="#" class="footer-social-btn"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="footer-social-btn"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="footer-social-btn"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="footer-social-btn"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="col-6 col-lg-2">
                    <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                        Marketplace
                    </h6>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#/browse"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Browse Cars</a></li>
                        <li><a href="#/create"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Sell a Car</a></li>
                        <li><a href="#/favorites"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Favorites</a></li>
                    </ul>
                </div>

                <!-- Account -->
                <div class="col-6 col-lg-2">
                    <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                        Account
                    </h6>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#/login"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Login</a></li>
                        <li><a href="#/register"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>Register</a></li>
                        <li><a href="#/profile"><i class="bi bi-chevron-right me-1" style="font-size: 0.7rem;"></i>My Profile</a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="col-lg-4">
                    <h6 style="font-family: var(--am-font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                        Stay Updated
                    </h6>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">
                        Subscribe to get the latest listings and deals.
                    </p>
                    <div class="input-group" style="max-width: 340px;">
                        <input type="email" id="footer-newsletter-email" class="form-control" placeholder="your@email.com"
                               style="border-radius: 8px 0 0 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff;">
                        <button id="footer-newsletter-btn" class="btn btn-am-primary" style="border-radius: 0 8px 8px 0; padding: 0 1.2rem;">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                </div>
            </div>

            <hr style="border-color: rgba(255,255,255,0.08);" />

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                <p style="color: rgba(255,255,255,0.35); font-size: 0.82rem; margin: 0;">
                    &copy; ${year} AutoMarket AI. All rights reserved.
                </p>
                <div class="d-flex gap-3">
                    <a href="#" class="legal-link" data-type="privacy" style="color: rgba(255,255,255,0.35); font-size: 0.82rem; text-decoration: none;">Privacy Policy</a>
                    <a href="#" class="legal-link" data-type="tos" style="color: rgba(255,255,255,0.35); font-size: 0.82rem; text-decoration: none;">Terms of Service</a>
                </div>
            </div>
        </div>

        <!-- Subscription Modal -->
        <div class="modal fade" id="newsletter-modal" tabindex="-1" aria-labelledby="newsletterModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border: none; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                    <div style="background: var(--am-gradient-primary); padding: 2rem 1.5rem; text-align: center; position: relative;">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="position: absolute; top: 15px; right: 15px;"></button>
                        <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 2px solid rgba(255,255,255,0.4);">
                            <i class="bi bi-envelope-check" style="font-size: 2.5rem; color: #fff;"></i>
                        </div>
                        <h4 class="modal-title text-white fw-bold mb-0" id="newsletterModalLabel" style="font-family: var(--am-font-display);">Subscription Successful!</h4>
                    </div>
                    <div class="modal-body text-center p-4">
                        <p class="text-muted mb-2" style="font-size: 1.1rem;">You're now on the list.</p>
                        <p style="font-size: 1.05rem; margin-bottom: 1rem;">We've sent a confirmation to <br><strong id="subscribed-email-display" style="color: var(--am-primary); font-size: 1.15rem;"></strong></p>
                        <p class="text-muted small mt-3 mb-0">Get ready for the best car deals straight to your inbox.</p>
                    </div>
                    <div class="modal-footer border-0 pb-4 justify-content-center">
                        <button type="button" class="btn btn-am-primary px-4 py-2" data-bs-dismiss="modal" style="border-radius: var(--am-radius-sm);">Awesome, thanks!</button>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <style>
        .footer-links li {
            margin-bottom: 0.6rem;
        }
        .footer-links a {
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
        }
        .footer-links a:hover {
            color: var(--am-accent-light);
            padding-left: 4px;
        }
        .footer-social-btn {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }
        .footer-social-btn:hover {
            background: var(--am-primary);
            color: #fff;
            border-color: var(--am-primary);
            transform: translateY(-2px);
        }
        #footer-newsletter-email::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
    </style>`;
}

/**
 * Initialize footer event listeners.
 */
export function initFooter() {
    const btn = document.getElementById('footer-newsletter-btn');
    const input = document.getElementById('footer-newsletter-email');
    
    if (btn && input) {
        btn.addEventListener('click', () => {
            const email = input.value.trim();
            if (!email) {
                showToast('Please enter an email address to subscribe.', 'warning');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', 'danger');
                return;
            }
            
            const emailDisplay = document.getElementById('subscribed-email-display');
            if (emailDisplay) emailDisplay.textContent = email;
            
            const modalEl = document.getElementById('newsletter-modal');
            if (modalEl) {
                const modal = Modal.getOrCreateInstance(modalEl);
                modal.show();
            } else {
                showToast('Subscribed to newsletter with ' + email, 'success');
            }
            
            input.value = '';
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btn.click();
            }
        });
    }

    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.querySelectorAll('.legal-link').forEach(link => {
            // Remove old listeners to prevent duplicates if init is called multiple times
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                showLegalModal(e.currentTarget.dataset.type);
            });
        });
    }
}
