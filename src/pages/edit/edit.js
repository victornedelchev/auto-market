/**
 * Edit Listing page.
 * Premium edit form mirroring the create page style with delete action.
 */
import { getListingById, updateListing, deleteListing } from '../../services/listingService.js';
import { listImages, getPublicUrl, uploadMultipleImages, deleteImage } from '../../services/storageService.js';
import { navigateTo } from '../../utils/router.js';
import { getUser, isAdminUser } from '../../utils/authState.js';
import { showConfirmModal } from '../../utils/modalService.js';
import { validateImageFiles } from '../create/create.js';
import { showToast } from '../../utils/toastService.js';

let currentImageCount = 0;

/**
 * Render the edit listing page.
 * @param {Object} params
 * @param {string} params.id
 * @returns {string} The page markup.
 */
export function renderEditPage(params = {}) {
    const { id = 'unknown' } = params;

    return `
    <!-- Page Header -->
    <div style="background: var(--am-gradient-hero); padding: 2.5rem 0 3rem;">
        <div class="container">
            <div class="d-flex align-items-center gap-3">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-pencil-square" style="color: var(--am-accent-light); font-size: 1.3rem;"></i>
                </div>
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff; margin: 0;">Edit Listing</h1>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;" id="edit-header-subtitle">Loading listing details...</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2; margin-bottom: 2rem;">
        <div class="card-am-static">
            
            <div id="edit-loading" class="p-5 text-center">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-3 text-muted">Fetching listing data...</p>
            </div>

            <form id="edit-listing-form" data-listing-id="${id}" class="needs-validation" novalidate style="display: none;">
                <!-- Section 0: Quick Fill -->
                <div class="p-4 mb-3" style="border-bottom: 1px solid #e2e8f0; background: rgba(13, 202, 240, 0.05);">
                    <div class="section-header mb-3">
                        <div class="section-icon" style="background: rgba(13, 202, 240, 0.1); color: var(--am-info);"><i class="bi bi-magic"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">AI Extract Specifications</h3>
                            <span class="section-subtitle">Paste a car description to automatically extract specifications</span>
                        </div>
                    </div>
                    <div class="mb-3">
                        <textarea class="form-control" id="edit-extract-text" rows="3" placeholder="Paste car details here..."></textarea>
                    </div>
                    <button type="button" id="btn-extract-specs-edit" class="btn btn-sm btn-am-info" style="border-radius: var(--am-radius-full); padding: 0.4rem 1rem;">
                        ⚡ Extract Specifications
                    </button>
                </div>

                <!-- Section 1: Vehicle Info -->
                <div class="p-4" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-car-front"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">Vehicle Information</h3>
                            <span class="section-subtitle">Update your car details</span>
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label for="edit-title" class="form-label mb-0">Listing Title *</label>
                                <button type="button" id="btn-suggest-title-edit" class="btn btn-sm btn-am-primary" title="Suggest title with AI" style="border-radius: var(--am-radius-full); padding: 0.2rem 0.8rem;">
                                    💡 Suggest Title
                                </button>
                            </div>
                            <input type="text" class="form-control" id="edit-title" required />
                            <div class="invalid-feedback">Please enter a title.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-brand" class="form-label">Make (Brand) *</label>
                            <input type="text" class="form-control" id="edit-brand" required />
                            <div class="invalid-feedback">Please enter a brand.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-model" class="form-label">Model *</label>
                            <input type="text" class="form-control" id="edit-model" required />
                            <div class="invalid-feedback">Please enter a model.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-year" class="form-label">Year *</label>
                            <input type="number" class="form-control" id="edit-year" min="1885" max="${new Date().getFullYear()}" required />
                            <div class="invalid-feedback">Enter a valid year.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-price" class="form-label">Price (&euro;) *</label>
                            <input type="number" class="form-control" id="edit-price" min="0.01" step="0.01" required />
                            <div class="invalid-feedback">Enter a valid positive price.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-mileage" class="form-label">Mileage (km)</label>
                            <input type="number" class="form-control" id="edit-mileage" min="0.01" step="0.01" />
                            <div class="invalid-feedback">Enter a valid positive mileage.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-fuel_type" class="form-label">Fuel Type</label>
                            <select class="form-select" id="edit-fuel_type">
                                <option value="">Select</option>
                                <option value="gasoline">Petrol / Gasoline</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="lpg">LPG</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-transmission" class="form-label">Transmission</label>
                            <select class="form-select" id="edit-transmission">
                                <option value="">Select</option>
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-engine" class="form-label">Engine</label>
                            <input type="text" class="form-control" id="edit-engine" />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-horsepower" class="form-label">Horsepower (HP)</label>
                            <input type="number" class="form-control" id="edit-horsepower" min="0.01" step="0.01" />
                            <div class="invalid-feedback">Enter a valid positive horsepower.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-color" class="form-label">Color</label>
                            <input type="text" class="form-control" id="edit-color" />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-location" class="form-label">Location (City)</label>
                            <input type="text" class="form-control" id="edit-location" />
                        </div>
                    </div>
                </div>

                <!-- Section 2: Description -->
                <div class="p-4" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="section-header mb-0">
                            <div class="section-icon"><i class="bi bi-text-paragraph"></i></div>
                            <div>
                                <h3 style="font-size: 1.15rem;">Description</h3>
                                <span class="section-subtitle">Update your car's description</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="button" id="btn-improve-description" class="btn btn-sm btn-am-info" title="Improve current description with AI" style="border-radius: var(--am-radius-full); padding: 0.4rem 1rem;">
                                ✨ Improve Description
                            </button>
                            <button type="button" id="btn-generate-description" class="btn btn-sm btn-am-primary" title="Generate description with AI" style="border-radius: var(--am-radius-full); padding: 0.4rem 1rem;">
                                🤖 Generate Description
                            </button>
                        </div>
                    </div>
                    <textarea class="form-control" id="edit-description" rows="5"></textarea>
                </div>

                <!-- Section 3: Images -->
                <div class="p-4" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-images"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">Photos</h3>
                            <span class="section-subtitle">Manage your listing images</span>
                        </div>
                    </div>

                    <!-- Existing images placeholder -->
                    <div class="mb-3">
                        <label class="form-label">Current Images</label>
                        <div id="edit-existing-images" class="d-flex gap-2 flex-wrap">
                            <!-- Populated via JS -->
                        </div>
                    </div>

                    <div id="edit-image-dropzone" style="border: 2px dashed #cbd5e1; border-radius: var(--am-radius-lg); padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.3s ease; background: var(--am-light);">
                        <div style="width: 80px; height: 80px; background: var(--am-white); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: var(--am-shadow-sm);">
                            <i class="bi bi-cloud-arrow-up" style="font-size: 2.5rem; color: var(--am-primary);"></i>
                        </div>
                        <h4 style="color: var(--am-dark-800); font-weight: 600; margin-bottom: 0.5rem;">
                            Drag & drop images here
                        </h4>
                        <p style="color: var(--am-gray); margin-bottom: 1.5rem;">or</p>
                        <button type="button" class="btn btn-am-primary px-4 mb-3" style="border-radius: var(--am-radius-full);">Browse Files</button>
                        <small style="color: var(--am-gray-light); display: block;">JPG, PNG, WebP up to 5MB each.</small>
                        <input type="file" id="edit-images" multiple accept="image/*" style="display: none;" />
                    </div>
                    <div id="edit-images-preview" class="d-flex gap-2 flex-wrap mt-3"></div>
                </div>

                <!-- Actions -->
                <div class="p-4 d-flex justify-content-between align-items-center">
                    <button type="button" class="btn" id="btn-delete-listing" style="color: var(--am-danger); font-weight: 500;">
                        <i class="bi bi-trash3 me-1"></i>Delete Listing
                    </button>
                    <div class="d-flex gap-2">
                        <a href="#/details/${id}" class="btn btn-am-outline">Cancel</a>
                        <button type="submit" class="btn btn-am-primary px-4" id="submit-edit-btn">
                            <i class="bi bi-check-lg me-2"></i>Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>`;
}

/**
 * Initialize the edit page.
 * @param {Object} params 
 */
export async function initEditPage(params) {
    const { id } = params;
    const form = document.getElementById('edit-listing-form');
    if (!form) return;

    const loadingDiv = document.getElementById('edit-loading');
    const user = getUser();

    if (!user) {
        navigateTo('/login');
        return;
    }

    try {
        // Fetch listing data
        const { data: listing, error } = await getListingById(id);

        if (error || !listing) {
            throw error || new Error('Listing not found');
        }

        // Ownership check
        if (listing.seller_id !== user.id && !isAdminUser()) {
            showToast('You do not have permission to edit this listing.', 'danger');
            loadingDiv.style.display = 'none';
            return;
        }

        // Populate fields
        document.getElementById('edit-title').value = listing.title || '';
        document.getElementById('edit-brand').value = listing.brand || '';
        document.getElementById('edit-model').value = listing.model || '';
        document.getElementById('edit-year').value = listing.year || '';
        document.getElementById('edit-price').value = listing.price || '';
        document.getElementById('edit-mileage').value = listing.mileage || '';
        document.getElementById('edit-fuel_type').value = listing.fuel_type || '';
        document.getElementById('edit-transmission').value = listing.transmission || '';
        document.getElementById('edit-engine').value = listing.engine || '';
        document.getElementById('edit-horsepower').value = listing.horsepower || '';
        document.getElementById('edit-color').value = listing.color || '';
        document.getElementById('edit-location').value = listing.location || '';
        document.getElementById('edit-description').value = listing.description || '';

        document.getElementById('edit-header-subtitle').textContent = `Update ${listing.title}`;

        // Fetch existing images
        await renderExistingImages(id);

        // Show form
        loadingDiv.style.display = 'none';
        form.style.display = 'block';

        // Attach listeners
        form.addEventListener('submit', (e) => handleEditSubmit(e, id));
        document.getElementById('btn-delete-listing').addEventListener('click', () => handleDeleteListing(id));

        // Image dropzone UX and drag-and-drop
        const dropzone = document.getElementById('edit-image-dropzone');
        const imageInput = document.getElementById('edit-images');
        const previewContainer = document.getElementById('edit-images-preview');
        
        if (dropzone && imageInput && previewContainer) {
            let accumulatedFiles = new DataTransfer();

            const highlight = () => {
                dropzone.style.borderColor = 'var(--am-primary-200)';
                dropzone.style.background = 'var(--am-primary-50)';
            };
            const unhighlight = () => {
                dropzone.style.borderColor = '#e2e8f0';
                dropzone.style.background = 'transparent';
            };

            dropzone.addEventListener('mouseover', highlight);
            dropzone.addEventListener('mouseout', unhighlight);
            dropzone.addEventListener('dragenter', (e) => { e.preventDefault(); e.stopPropagation(); highlight(); });
            dropzone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); highlight(); });
            dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); unhighlight(); });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                unhighlight();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    for (let file of e.dataTransfer.files) {
                        accumulatedFiles.items.add(file);
                    }
                    imageInput.files = accumulatedFiles.files;
                    renderPreviews();
                }
            });

            dropzone.addEventListener('click', (e) => {
                if (e.target !== imageInput) {
                    imageInput.click();
                }
            });

            imageInput.addEventListener('change', (e) => {
                if (e.isTrusted && imageInput.files.length > 0) {
                    for (let file of imageInput.files) {
                        accumulatedFiles.items.add(file);
                    }
                    imageInput.files = accumulatedFiles.files;
                }
                renderPreviews();
            });

            const renderPreviews = () => {
                previewContainer.innerHTML = '';
                const files = Array.from(imageInput.files);
                
                const validationError = validateImageFiles(files, currentImageCount);
                if (validationError) {
                    showToast(validationError, 'danger');
                    return;
                }

                files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const div = document.createElement('div');
                        div.style.cssText = 'width: 100px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; position: relative;';
                        div.innerHTML = `
                            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
                            <button type="button" class="position-absolute top-0 end-0 m-1 btn-remove-image remove-preview-btn" aria-label="Remove image" data-index="${index}"><i class="bi bi-x"></i></button>
                        `;
                        previewContainer.appendChild(div);
                    };
                    reader.readAsDataURL(file);
                });
            };

            previewContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.remove-preview-btn');
                if (btn) {
                    const indexToRemove = parseInt(btn.getAttribute('data-index'), 10);
                    const dt = new DataTransfer();
                    const files = Array.from(accumulatedFiles.files);
                    
                    for (let i = 0; i < files.length; i++) {
                        if (i !== indexToRemove) {
                            dt.items.add(files[i]);
                        }
                    }
                    
                    accumulatedFiles = dt;
                    imageInput.files = accumulatedFiles.files;
                    renderPreviews();
                }
            });
        }

        // AI Extract Specs logic
        const btnExtractSpecsEdit = document.getElementById('btn-extract-specs-edit');
        if (btnExtractSpecsEdit) {
            btnExtractSpecsEdit.addEventListener('click', async () => {
                const textarea = document.getElementById('edit-extract-text');
                const text = textarea.value.trim();
                if (!text) {
                    showToast('Please paste a description first.', 'warning');
                    return;
                }

                const originalText = btnExtractSpecsEdit.innerHTML;
                btnExtractSpecsEdit.disabled = true;
                btnExtractSpecsEdit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Extracting...';

                try {
                    const { extractSpecifications } = await import('../../services/aiService.js');
                    const specs = await extractSpecifications(text);

                    if (specs) {
                        const mappings = {
                            brand: 'edit-brand',
                            model: 'edit-model',
                            year: 'edit-year',
                            mileage: 'edit-mileage',
                            fuel: 'edit-fuel_type',
                            transmission: 'edit-transmission',
                            horsepower: 'edit-horsepower',
                            color: 'edit-color',
                            engine: 'edit-engine',
                            price: 'edit-price'
                        };

                        let filledCount = 0;
                        for (const [key, id] of Object.entries(mappings)) {
                            if (specs[key] !== undefined && specs[key] !== null && specs[key] !== '') {
                                const el = document.getElementById(id);
                                if (el) {
                                    if (el.tagName === 'SELECT') {
                                        const val = String(specs[key]).toLowerCase();
                                        const options = Array.from(el.options).map(o => o.value);
                                        if (options.includes(val)) {
                                            el.value = val;
                                            el.dispatchEvent(new Event('change'));
                                            filledCount++;
                                        }
                                    } else {
                                        el.value = specs[key];
                                        el.dispatchEvent(new Event('input'));
                                        filledCount++;
                                    }
                                }
                            }
                        }

                        if (filledCount > 0) {
                            showToast(`Successfully extracted ${filledCount} fields!`, 'success');
                            textarea.value = ''; // clear it on success
                        } else {
                            showToast('No valid specifications found in the text.', 'warning');
                        }
                    } else {
                        showToast('Failed to extract specifications.', 'danger');
                    }
                } catch (error) {
                    console.error(error);
                    showToast('Error extracting specifications.', 'danger');
                } finally {
                    btnExtractSpecsEdit.disabled = false;
                    btnExtractSpecsEdit.innerHTML = originalText;
                }
            });
        }

        // AI Suggest Title logic
        const btnSuggestTitleEdit = document.getElementById('btn-suggest-title-edit');
        if (btnSuggestTitleEdit) {
            btnSuggestTitleEdit.addEventListener('click', async () => {
                const brand = document.getElementById('edit-brand').value.trim();
                const model = document.getElementById('edit-model').value.trim();
                const year = document.getElementById('edit-year').value.trim();
                const mileage = document.getElementById('edit-mileage').value.trim();
                const fuel = document.getElementById('edit-fuel_type').value;
                const transmission = document.getElementById('edit-transmission').value;
                const horsepower = document.getElementById('edit-horsepower').value.trim();

                if (!brand || !model || !year) {
                    showToast('Please fill in Brand, Model, and Year to suggest a title.', 'warning');
                    return;
                }

                const originalText = btnSuggestTitleEdit.innerHTML;
                btnSuggestTitleEdit.disabled = true;
                btnSuggestTitleEdit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>...';

                try {
                    const { generateTitle } = await import('../../services/aiService.js');
                    const generatedTitle = await generateTitle({
                        make: brand,
                        model: model,
                        year: year,
                        fuel_type: fuel,
                        horsepower: horsepower,
                        transmission: transmission,
                        mileage: mileage
                    });

                    if (generatedTitle && !generatedTitle.toLowerCase().includes('error') && !generatedTitle.toLowerCase().includes('unavailable')) {
                        document.getElementById('edit-title').value = generatedTitle;
                        document.getElementById('edit-title').dispatchEvent(new Event('input'));
                        showToast('Title generated successfully!', 'success');
                    } else {
                        showToast(generatedTitle || 'Could not generate title.', 'danger');
                    }
                } catch (error) {
                    console.error(error);
                    showToast('Error generating title.', 'danger');
                } finally {
                    btnSuggestTitleEdit.disabled = false;
                    btnSuggestTitleEdit.innerHTML = originalText;
                }
            });
        }

        // AI Generate Description logic
        const btnGenerateDescription = document.getElementById('btn-generate-description');
        if (btnGenerateDescription) {
            btnGenerateDescription.addEventListener('click', async () => {
                const brand = document.getElementById('edit-brand').value.trim();
                const model = document.getElementById('edit-model').value.trim();
                const year = document.getElementById('edit-year').value.trim();
                const mileage = document.getElementById('edit-mileage').value.trim();
                const fuel = document.getElementById('edit-fuel_type').value;
                const transmission = document.getElementById('edit-transmission').value;
                const horsepower = document.getElementById('edit-horsepower').value.trim();
                const color = document.getElementById('edit-color').value.trim();
                const price = document.getElementById('edit-price').value.trim();

                if (!brand || !model || !year) {
                    showToast('Please fill in Brand, Model, and Year to generate a description.', 'warning');
                    return;
                }

                btnGenerateDescription.disabled = true;
                btnGenerateDescription.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Generating description...';
                const btnImproveDescription = document.getElementById('btn-improve-description');
                if (btnImproveDescription) btnImproveDescription.disabled = true;

                const existingAlert = document.getElementById('ai-alert-generate-edit');
                if (existingAlert) existingAlert.remove();

                try {
                    const { generateDescription } = await import('../../services/aiService.js');
                    const generatedText = await generateDescription({
                        make: brand,
                        model: model,
                        year: year,
                        mileage: mileage,
                        fuel_type: fuel,
                        transmission: transmission,
                        horsepower: horsepower,
                        color: color,
                        price: price
                    });

                    document.getElementById('edit-description').value = generatedText;
                    showToast('Description generated successfully.', 'success');
                } catch (err) {
                    console.error(err);
                    const alertHtml = `<div id="ai-alert-generate-edit" class="alert alert-danger mt-3 mb-3" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i> Failed to generate description.</div>`;
                    document.getElementById('edit-description').insertAdjacentHTML('beforebegin', alertHtml);
                } finally {
                    btnGenerateDescription.disabled = false;
                    btnGenerateDescription.innerHTML = '🤖 Generate Description';
                    if (btnImproveDescription) btnImproveDescription.disabled = false;
                }
            });
        }

        // AI Improve Description logic
        const btnImproveDescription = document.getElementById('btn-improve-description');
        if (btnImproveDescription) {
            btnImproveDescription.addEventListener('click', async () => {
                const descriptionArea = document.getElementById('edit-description');
                const currentDesc = descriptionArea.value.trim();
                if (!currentDesc) {
                    showToast('Please write some description first before improving.', 'warning');
                    return;
                }

                btnImproveDescription.disabled = true;
                btnImproveDescription.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Generating description...';
                const btnGenerateDescription = document.getElementById('btn-generate-description');
                if (btnGenerateDescription) btnGenerateDescription.disabled = true;

                const existingAlert = document.getElementById('ai-alert-improve-edit');
                if (existingAlert) existingAlert.remove();

                try {
                    const { improveDescription } = await import('../../services/aiService.js');
                    const improvedText = await improveDescription(currentDesc);
                    descriptionArea.value = improvedText;
                    showToast('Description generated successfully.', 'success');
                } catch (err) {
                    console.error(err);
                    const alertHtml = `<div id="ai-alert-improve-edit" class="alert alert-danger mt-3 mb-3" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i> Failed to improve description.</div>`;
                    document.getElementById('edit-description').insertAdjacentHTML('beforebegin', alertHtml);
                } finally {
                    btnImproveDescription.disabled = false;
                    btnImproveDescription.innerHTML = '✨ Improve Description';
                    if (btnGenerateDescription) btnGenerateDescription.disabled = false;
                }
            });
        }

    } catch (err) {
        console.error(err);
        loadingDiv.style.display = 'none';
        showToast('Failed to load listing details.', 'danger');
    }
}

/**
 * Handle edit form submission.
 */
async function handleEditSubmit(e, id) {
    e.preventDefault();
    const form = e.target;
    
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const submitBtn = document.getElementById('submit-edit-btn');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...';

    const imageInput = document.getElementById('edit-images');
    const files = Array.from(imageInput.files);
    
    const validationError = validateImageFiles(files, currentImageCount);
    if (validationError) {
        showToast(validationError, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
        return;
    }

    const yearVal = parseInt(document.getElementById('edit-year').value, 10);
    const currentYear = new Date().getFullYear();
    if (yearVal < 1885 || yearVal > currentYear) {
        showToast(`Year must be between 1885 and ${currentYear}.`, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
        return;
    }

    const priceVal = parseFloat(document.getElementById('edit-price').value);
    if (priceVal <= 0) {
        showToast('Price must be a positive number.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
        return;
    }

    const mileageStr = document.getElementById('edit-mileage').value;
    if (mileageStr && parseFloat(mileageStr) <= 0) {
        showToast('Mileage must be a positive number.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
        return;
    }

    const hpStr = document.getElementById('edit-horsepower').value;
    if (hpStr && parseFloat(hpStr) <= 0) {
        showToast('Horsepower must be a positive number.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
        return;
    }

    const updates = {
        title: document.getElementById('edit-title').value.trim(),
        brand: document.getElementById('edit-brand').value.trim(),
        model: document.getElementById('edit-model').value.trim(),
        year: parseInt(document.getElementById('edit-year').value, 10),
        price: parseFloat(document.getElementById('edit-price').value),
        mileage: parseInt(document.getElementById('edit-mileage').value, 10) || null,
        fuel_type: document.getElementById('edit-fuel_type').value || null,
        transmission: document.getElementById('edit-transmission').value || null,
        engine: document.getElementById('edit-engine').value.trim() || null,
        horsepower: parseInt(document.getElementById('edit-horsepower').value, 10) || null,
        color: document.getElementById('edit-color').value.trim() || null,
        location: document.getElementById('edit-location').value.trim() || null,
        description: document.getElementById('edit-description').value.trim() || null,
        updated_at: new Date().toISOString()
    };

    try {
        // AI Generate Keywords automatically
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Generating AI Keywords...';
        try {
            const { generateKeywords } = await import('../../services/aiService.js');
            const keywords = await generateKeywords(updates);
            if (keywords) {
                updates.search_keywords = keywords;
            }
        } catch (kwErr) {
            console.error('Failed to generate keywords during edit', kwErr);
        }

        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...';

        const { error } = await updateListing(id, updates);
        if (error) throw error;

        // Upload new images if any
        if (files.length > 0) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Uploading images...';
            await uploadMultipleImages(id, files);
        }

        showToast('Listing updated successfully!', 'success');
        
        setTimeout(() => {
            navigateTo('/profile');
        }, 1500);

    } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to update listing.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
    }
}

/**
 * Fetch and render existing images with delete capability.
 */
async function renderExistingImages(listingId) {
    const { data: files } = await listImages(listingId);
    const container = document.getElementById('edit-existing-images');
    
    if (!files || files.length === 0) {
        container.innerHTML = '<span class="text-muted small">No images uploaded yet.</span>';
        currentImageCount = 0;
        return;
    }

    const validFiles = files.filter(f => !f.name.startsWith('.'));
    currentImageCount = validFiles.length;

    container.innerHTML = validFiles.map((file, index) => {
        const filePath = `${listingId}/${file.name}`;
        const url = getPublicUrl(filePath);
        const isCover = index === 0;
        return `
            <div style="width: 100px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid ${isCover ? 'var(--am-primary)' : '#e2e8f0'}; position: relative; group">
                <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" alt="Listing Image" />
                ${isCover ? '<div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(37,99,235,0.9); color: white; font-size: 0.6rem; text-align: center; padding: 2px;">COVER</div>' : ''}
                <button type="button" class="position-absolute top-0 end-0 m-1 btn-remove-image" aria-label="Delete image" data-path="${filePath}" onclick="window.handleDeleteImage('${filePath}', '${listingId}')"><i class="bi bi-x"></i></button>
            </div>
        `;
    }).join('');
}

/**
 * Handle deleting a single image. Exposed globally for inline onclick.
 */
window.handleDeleteImage = async function handleRemoveExistingImage(filePath, listingId) {
    const confirmed = await showConfirmModal(
        'Delete Image',
        'Delete this image permanently?',
        'Delete',
        'danger'
    );
    if (!confirmed) return;

    try {
        const { error } = await deleteImage(filePath);
        if (error) {
            showToast('Failed to delete image: ' + error.message, 'danger');
            return;
        }
        
        // Refresh images
        await renderExistingImages(listingId);
    } catch (err) {
        console.error(err);
        showToast('Error deleting image', 'danger');
    }
};

/**
 * Handle listing deletion.
 */
async function handleDeleteListing(id) {
    const confirmed = await showConfirmModal(
        'Delete Listing',
        'Are you sure you want to delete this listing? This action cannot be undone.',
        'Delete',
        'danger'
    );
    if (!confirmed) return;

    const btn = document.getElementById('btn-delete-listing');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Deleting...';

    try {
        const { error } = await deleteListing(id);
        if (error) throw error;

        showToast('Listing deleted successfully.', 'success');
        navigateTo('/profile');
    } catch (err) {
        console.error(err);
        showToast('Failed to delete listing: ' + (err.message || 'Unknown error'), 'danger');
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-trash3 me-1"></i>Delete Listing';
    }
}
