/**
 * Toast Service
 * Dynamically displays Bootstrap Toast notifications.
 */
import { Toast } from 'bootstrap';

/**
 * Show a toast notification.
 * @param {string} message - The message to display.
 * @param {string} [type='info'] - 'success', 'error', 'danger', 'warning', 'info'
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    let icon = 'bi-info-circle-fill';
    let bgClass = 'bg-primary text-white';

    if (type === 'error' || type === 'danger') {
        icon = 'bi-exclamation-triangle-fill';
        bgClass = 'bg-danger text-white';
    } else if (type === 'success') {
        icon = 'bi-check-circle-fill';
        bgClass = 'bg-success text-white';
    } else if (type === 'warning') {
        icon = 'bi-exclamation-triangle-fill';
        bgClass = 'bg-warning text-dark';
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center border-0 ${bgClass}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    // Make close button dark for warning background
    const btnClass = type === 'warning' ? 'btn-close' : 'btn-close btn-close-white';

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi ${icon} me-2"></i> ${message}
            </div>
            <button type="button" class="${btnClass} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);
    
    // Initialize and show toast via imported Toast class
    const toast = new Toast(toastEl, { delay: 4000 });
    toast.show();

    // Clean up DOM after toast is hidden
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}
