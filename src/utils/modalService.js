/**
 * Modal Service
 * Dynamically creates and manages Bootstrap Modals for confirmations.
 */
import { Modal } from 'bootstrap';

/**
 * Show a confirmation modal.
 * @param {string} title - The modal title.
 * @param {string} message - The modal message.
 * @param {string} [confirmText='Confirm'] - The text for the confirm button.
 * @param {string} [confirmStyle='danger'] - Bootstrap color class for the confirm button.
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled.
 */
export function showConfirmModal(title, message, confirmText = 'Confirm', confirmStyle = 'danger') {
    return new Promise((resolve) => {
        const modalEl = document.createElement('div');
        modalEl.className = 'modal fade';
        modalEl.tabIndex = -1;
        const isDanger = confirmStyle === 'danger';
        const iconClass = isDanger ? 'bi-exclamation-triangle-fill text-danger' : 'bi-info-circle-fill text-primary';
        const iconBg = isDanger ? 'rgba(239,68,68,0.1)' : 'rgba(37,99,235,0.1)';
        const shadowColor = isDanger ? 'rgba(239,68,68,0.3)' : 'rgba(37,99,235,0.3)';

        modalEl.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
                <div class="modal-content" style="border-radius: var(--am-radius-lg); border: none; box-shadow: 0 20px 50px rgba(0,0,0,0.15); overflow: hidden;">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>
                    <div class="modal-body text-center py-5 px-4 relative">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: ${isDanger ? 'var(--am-danger)' : 'var(--am-gradient-primary)'};"></div>
                        <div style="width: 72px; height: 72px; border-radius: 50%; background: ${iconBg}; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                            <i class="bi ${iconClass}" style="font-size: 2.2rem;"></i>
                        </div>
                        <h4 style="font-family: var(--am-font-display); font-weight: 800; margin-bottom: 0.75rem;">${title}</h4>
                        <p style="color: var(--am-gray); margin-bottom: 2rem; font-size: 1rem; line-height: 1.6;">${message}</p>
                        <div class="d-flex gap-3 justify-content-center">
                            <button type="button" class="btn btn-light flex-fill py-2" data-bs-dismiss="modal" style="border-radius: var(--am-radius-sm); font-weight: 600; background: var(--am-light); border: none; color: var(--am-dark-600);">Cancel</button>
                            <button type="button" class="btn btn-am-${confirmStyle} flex-fill py-2" id="confirm-modal-btn" style="border-radius: var(--am-radius-sm); font-weight: 600; box-shadow: 0 4px 12px ${shadowColor};">${confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalEl);

        const modalInstance = new Modal(modalEl, {
            backdrop: 'static',
            keyboard: false
        });

        let isConfirmed = false;

        const handleConfirm = () => {
            isConfirmed = true;
            modalInstance.hide();
        };

        const handleHidden = () => {
            modalEl.remove();
            resolve(isConfirmed);
        };

        modalEl.querySelector('#confirm-modal-btn').addEventListener('click', handleConfirm);
        modalEl.addEventListener('hidden.bs.modal', handleHidden);

        modalInstance.show();
    });
}

/**
 * Show a legal document modal (Privacy Policy or Terms of Service).
 * @param {string} type - 'privacy' or 'tos'
 */
export function showLegalModal(type) {
    const isPrivacy = type === 'privacy';
    const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
    const content = isPrivacy ? `
        <div class="text-start" style="color: var(--am-dark-700); font-size: 0.95rem; max-height: 55vh; overflow-y: auto; padding-right: 1rem;">
            <h6 class="fw-bold mb-2">1. Information We Collect</h6>
            <p class="mb-4">We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include your name, email address, phone number, and profile picture.</p>
            <h6 class="fw-bold mb-2">2. Use of Information</h6>
            <p class="mb-4">We may use the information we collect about you to provide, maintain, and improve our services. This includes facilitating your car listings, connecting buyers and sellers, developing safety features, authenticating users, and sending administrative messages.</p>
            <h6 class="fw-bold mb-2">3. Sharing of Information</h6>
            <p class="mb-4">We do not sell your personal information. We may share the information we collect with third-party service providers who need access to such information to carry out work on our behalf, or when required by law to protect the rights and safety of our users.</p>
            <h6 class="fw-bold mb-2">4. Data Security</h6>
            <p class="mb-0">We implement robust security measures to protect your personal data. However, please be aware that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
        </div>
    ` : `
        <div class="text-start" style="color: var(--am-dark-700); font-size: 0.95rem; max-height: 55vh; overflow-y: auto; padding-right: 1rem;">
            <h6 class="fw-bold mb-2">1. Acceptance of Terms</h6>
            <p class="mb-4">By accessing and using AutoMarket, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
            <h6 class="fw-bold mb-2">2. Description of Service</h6>
            <p class="mb-4">AutoMarket provides an AI-powered platform for users to list, browse, and manage vehicle advertisements. We act as an intermediary and are not a party to any transactions between buyers and sellers.</p>
            <h6 class="fw-bold mb-2">3. User Conduct</h6>
            <p class="mb-4">You agree to use our services only for lawful purposes. You are solely responsible for all information, data, text, photographs, and materials you upload. You agree not to post false, misleading, or inappropriate content.</p>
            <h6 class="fw-bold mb-2">4. Account Termination</h6>
            <p class="mb-0">We reserve the right to suspend or terminate your account at any time, with or without cause, including for violations of these Terms of Service or for behavior that harms the community or platform integrity.</p>
        </div>
    `;

    return new Promise((resolve) => {
        const modalEl = document.createElement('div');
        modalEl.className = 'modal fade';
        modalEl.tabIndex = -1;

        modalEl.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content" style="border-radius: var(--am-radius-lg); border: none; box-shadow: 0 20px 50px rgba(0,0,0,0.15);">
                    <div class="modal-header" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 1.5rem; background: var(--am-light); border-top-left-radius: var(--am-radius-lg); border-top-right-radius: var(--am-radius-lg);">
                        <div class="d-flex align-items-center gap-3">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center;">
                                <i class="bi ${isPrivacy ? 'bi-shield-check' : 'bi-file-earmark-text'} text-white"></i>
                            </div>
                            <h5 class="modal-title mb-0" style="font-family: var(--am-font-display); font-weight: 800; color: var(--am-dark);">${title}</h5>
                        </div>
                        <button type="button" class="btn-close legal-close-btn" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="padding: 2rem;">
                        ${content}
                    </div>
                    <div class="modal-footer" style="border-top: 1px solid rgba(0,0,0,0.05); padding: 1.25rem 1.5rem; background: var(--am-light); border-bottom-left-radius: var(--am-radius-lg); border-bottom-right-radius: var(--am-radius-lg);">
                        <button type="button" class="btn btn-am-primary legal-close-btn" style="border-radius: var(--am-radius-sm); font-weight: 600; padding: 0.5rem 2rem;">I Understand</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalEl);

        const modalInstance = new Modal(modalEl, {
            backdrop: 'static'
        });

        modalEl.querySelectorAll('.legal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modalInstance.hide();
            });
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
            modalEl.remove();
            resolve();
        });

        modalInstance.show();
    });
}
