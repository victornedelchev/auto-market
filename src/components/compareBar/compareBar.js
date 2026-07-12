import { getListingById } from '../../services/listingService.js';
import { generateCarComparison } from '../../services/aiService.js';
import { showToast } from '../../utils/toastService.js';
import * as bootstrap from 'bootstrap';

let selectedForComparison = [];
let isInitialized = false;

export function renderCompareBar() {
    return `
    <!-- Floating Compare Bar -->
    <div id="compare-floating-bar" class="position-fixed bottom-0 start-50 translate-middle-x mb-4 bg-white rounded-pill shadow px-4 py-2 d-none" style="z-index: 1050; display: flex; align-items: center; gap: 1rem; border: 1px solid var(--am-gray-light);">
        <span id="compare-count-text" style="font-weight: 600; color: var(--am-dark);">0 cars selected</span>
        <button id="btn-compare-now" class="btn btn-primary btn-sm rounded-pill px-3 fw-bold" disabled>
            <i class="bi bi-stars me-1"></i> Compare with AI
        </button>
        <button id="btn-compare-clear" class="btn btn-light rounded-circle p-0 d-inline-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" title="Clear selection">
            <i class="bi bi-x fs-5"></i>
        </button>
    </div>

    <!-- AI Compare Modal -->
    <div class="modal fade" id="compareModal" tabindex="-1" aria-labelledby="compareModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header border-0 bg-light">
                    <h5 class="modal-title fw-bold" id="compareModalLabel">
                        <i class="bi bi-robot text-primary me-2"></i> AI Compare Cars
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4" id="compare-modal-body">
                    <!-- Comparison content goes here -->
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

export function updateCompareBar() {
    const floatingBar = document.getElementById('compare-floating-bar');
    const compareCountText = document.getElementById('compare-count-text');
    const btnCompareNow = document.getElementById('btn-compare-now');

    if (!floatingBar) return;

    if (selectedForComparison.length > 0) {
        floatingBar.classList.remove('d-none');
        compareCountText.textContent = `${selectedForComparison.length} car${selectedForComparison.length > 1 ? 's' : ''} selected`;
        btnCompareNow.disabled = selectedForComparison.length !== 2;
    } else {
        floatingBar.classList.add('d-none');
    }

    // Update buttons everywhere on the page
    document.querySelectorAll('.compare-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (selectedForComparison.includes(id)) {
            // Selected state
            btn.classList.replace('btn-am-info', 'btn-am-accent');
            btn.classList.replace('btn-outline-secondary', 'btn-am-accent');
            btn.classList.replace('btn-primary', 'btn-am-accent');
        } else {
            // Unselected state
            btn.classList.replace('btn-am-accent', 'btn-am-info');
            btn.classList.replace('btn-outline-secondary', 'btn-am-info');
            btn.classList.replace('btn-primary', 'btn-am-info');
        }
    });
}

export function toggleCompareSelection(listingId) {
    if (selectedForComparison.includes(listingId)) {
        selectedForComparison = selectedForComparison.filter(id => id !== listingId);
    } else {
        if (selectedForComparison.length >= 2) {
            showToast('You can only compare up to 2 cars at a time.', 'warning');
            return;
        }
        selectedForComparison.push(listingId);
    }
    updateCompareBar();
}

export function clearCompareSelection() {
    selectedForComparison = [];
    updateCompareBar();
}

export function initCompareBar() {
    if (isInitialized) return;
    isInitialized = true;

    // Global delegated listener for ALL compare buttons
    document.body.addEventListener('click', (e) => {
        const compareBtn = e.target.closest('.compare-btn');
        if (compareBtn) {
            const listingId = compareBtn.getAttribute('data-id');
            toggleCompareSelection(listingId);
        }
    });

    const btnCompareClear = document.getElementById('btn-compare-clear');
    if (btnCompareClear) {
        btnCompareClear.addEventListener('click', () => {
            clearCompareSelection();
        });
    }

    const btnCompareNow = document.getElementById('btn-compare-now');
    if (btnCompareNow) {
        btnCompareNow.addEventListener('click', async () => {
            if (selectedForComparison.length !== 2) return;
            
            const modalEl = document.getElementById('compareModal');
            if (!modalEl) return;
            
            const modal = new bootstrap.Modal(modalEl);
            const modalBody = document.getElementById('compare-modal-body');
            
            modalBody.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3">AI is analyzing and comparing the cars...</p></div>';
            modal.show();

            try {
                const [res1, res2] = await Promise.all([
                    getListingById(selectedForComparison[0]),
                    getListingById(selectedForComparison[1])
                ]);

                if (res1.error || res2.error || !res1.data || !res2.data) {
                    throw new Error('Could not fetch car details.');
                }

                const comparisonHtml = await generateCarComparison(res1.data, res2.data);
                modalBody.innerHTML = comparisonHtml;
            } catch (err) {
                console.error(err);
                modalBody.innerHTML = '<div class="alert alert-danger">Failed to generate comparison. Please try again.</div>';
            }
        });
    }
}
