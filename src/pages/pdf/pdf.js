import { getListingById } from '../../services/listingService.js';
import { getProfile } from '../../services/profileService.js';
import { getListingImageUrls } from '../../services/storageService.js';
import { generateListingPdf } from '../../utils/pdfRenderer.js';
import { showToast } from '../../utils/toastService.js';
import { navigateTo } from '../../utils/router.js';

export function renderPdfPage(params = {}) {
    return `
    <div class="container py-3" id="pdf-page-content" style="height: calc(100vh - 90px); display: flex; flex-direction: column;">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 style="font-family: var(--am-font-display); font-weight: 700; font-size: 1.5rem; margin: 0;">Listing PDF Document</h2>
            <div class="d-flex gap-2">
                <button id="btn-back-details" class="btn btn-am-outline">
                    <i class="bi bi-arrow-left me-1"></i>Back to Listing
                </button>
                <button id="btn-download-pdf" class="btn btn-am-primary" disabled>
                    <i class="bi bi-download me-1"></i>Download PDF
                </button>
            </div>
        </div>
        
        <div id="pdf-loading" class="flex-grow-1 d-flex justify-content-center align-items-center" style="background: var(--am-light); border-radius: var(--am-radius-lg); border: 1px solid #e2e8f0;">
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status"></div>
                <h5 style="color: var(--am-dark-700);">Generating PDF...</h5>
                <p style="color: var(--am-gray); font-size: 0.9rem;">Please wait while we prepare your document.</p>
            </div>
        </div>

        <iframe id="pdf-viewer" class="d-none" style="width: 100%; flex-grow: 1; border: 1px solid #e2e8f0; border-radius: var(--am-radius-lg); box-shadow: var(--am-shadow);"></iframe>
    </div>`;
}

export async function initPdfPage(params = {}) {
    const { id } = params;
    if (!id || id === 'unknown') {
        navigateTo('/browse');
        return;
    }

    const backBtn = document.getElementById('btn-back-details');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            navigateTo(`/details/${id}`);
        });
    }

    try {
        const { data: listing, error: listingError } = await getListingById(id);
        
        if (listingError || !listing) {
            showToast('Listing not found.', 'error');
            navigateTo('/browse');
            return;
        }

        const { data: seller } = await getProfile(listing.seller_id);
        const { urls: images } = await getListingImageUrls(id);

        const pdfBlob = await generateListingPdf(listing, seller, images);
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const loadingDiv = document.getElementById('pdf-loading');
        const iframe = document.getElementById('pdf-viewer');
        const downloadBtn = document.getElementById('btn-download-pdf');

        if (loadingDiv && iframe && downloadBtn) {
            loadingDiv.classList.remove('d-flex');
            loadingDiv.classList.add('d-none');
            iframe.classList.remove('d-none');
            iframe.classList.add('d-block');
            iframe.src = pdfUrl + '#toolbar=0'; // Hide iframe toolbar to force custom UI (supported by some browsers)

            downloadBtn.disabled = false;
            downloadBtn.addEventListener('click', async () => {
                const filename = `Listing-${listing.title.replace(/\s+/g, '-')}-${listing.year}.pdf`;
                
                if (window.showSaveFilePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: filename,
                            types: [{
                                description: 'PDF Document',
                                accept: { 'application/pdf': ['.pdf'] },
                            }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(pdfBlob);
                        await writable.close();
                        return;
                    } catch (err) {
                        if (err.name === 'AbortError') return;
                    }
                }
                
                // Fallback
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        }
    } catch (err) {
        console.error('Error generating PDF:', err);
        showToast('Failed to generate PDF document.', 'error');
        navigateTo(`/details/${id}`);
    }
}
