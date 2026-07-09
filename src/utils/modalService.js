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
