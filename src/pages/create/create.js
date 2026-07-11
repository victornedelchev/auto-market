/**
 * Create Listing page.
 * Premium multi-step style form with sections, icons, and visual cues.
 */
import { createListing } from '../../services/listingService.js';
import { uploadMultipleImages } from '../../services/storageService.js';
import { navigateTo } from '../../utils/router.js';
import { getUser } from '../../utils/authState.js';
import { showToast } from '../../utils/toastService.js';

/**
 * Render the create listing page.
 * @returns {string} The page markup.
 */
export function renderCreatePage() {
    return `
    <!-- Page Header -->
    <div style="background: var(--am-gradient-hero); padding: 2.5rem 0 3rem;">
        <div class="container">
            <div class="d-flex align-items-center gap-3">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-plus-circle-fill" style="color: var(--am-accent-light); font-size: 1.3rem;"></i>
                </div>
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff; margin: 0;">Create Listing</h1>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;">Sell your car to thousands of buyers</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -2.5rem; position: relative; z-index: 2; margin-bottom: 4rem; max-width: 900px;">
        <form id="create-listing-form" class="needs-validation" novalidate>
            
            <!-- Section 1: Vehicle Info -->
            <div class="card-am-static p-4 p-md-5 mb-4 anim-slide-up delay-100" style="border-top: 4px solid var(--am-primary); box-shadow: var(--am-shadow-md);">
                <div class="section-header mb-4">
                    <div class="section-icon"><i class="bi bi-car-front"></i></div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Vehicle Information</h3>
                        <span class="section-subtitle">Tell us about your car</span>
                    </div>
                </div>
                <div class="row g-4">
                    <div class="col-md-12">
                        <label for="create-title" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Listing Title *</label>
                        <input type="text" class="form-control form-control-lg" id="create-title" placeholder="e.g. BMW X5 M Sport 2022" required />
                        <div class="invalid-feedback">Please enter a title.</div>
                    </div>
                    <div class="col-md-4">
                        <label for="create-brand" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Make (Brand) *</label>
                        <input type="text" class="form-control" id="create-brand" placeholder="e.g. BMW" required />
                        <div class="invalid-feedback">Please enter a brand.</div>
                    </div>
                    <div class="col-md-4">
                        <label for="create-model" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Model *</label>
                        <input type="text" class="form-control" id="create-model" placeholder="e.g. X5" required />
                        <div class="invalid-feedback">Please enter a model.</div>
                    </div>
                    <div class="col-md-4">
                        <label for="create-year" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Year *</label>
                        <input type="number" class="form-control" id="create-year" placeholder="2022" min="1885" max="${new Date().getFullYear()}" required />
                        <div class="invalid-feedback">Enter a valid year.</div>
                    </div>
                    <div class="col-md-4">
                        <label for="create-price" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Price (&euro;) *</label>
                        <input type="number" class="form-control" id="create-price" placeholder="45000" min="0.01" step="0.01" required />
                        <div class="invalid-feedback">Enter a valid positive price.</div>
                    </div>
                    <div class="col-md-4">
                        <label for="create-mileage" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Mileage (km)</label>
                        <input type="number" class="form-control" id="create-mileage" placeholder="32000" min="0.01" step="0.01" />
                        <div class="invalid-feedback">Enter a valid positive mileage.</div>
                    </div>
                    <div class="col-md-4">
                        <label for="create-fuel_type" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Fuel Type</label>
                        <select class="form-select" id="create-fuel_type">
                            <option value="">Select</option>
                            <option value="gasoline">Petrol / Gasoline</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="lpg">LPG</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="create-transmission" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Transmission</label>
                        <select class="form-select" id="create-transmission">
                            <option value="">Select</option>
                            <option value="automatic">Automatic</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="create-engine" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Engine</label>
                        <input type="text" class="form-control" id="create-engine" placeholder="e.g. 3.0L Turbo" />
                    </div>
                    <div class="col-md-4">
                        <label for="create-horsepower" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Horsepower (HP)</label>
                        <input type="number" class="form-control" id="create-horsepower" placeholder="e.g. 300" min="0.01" step="0.01" />
                        <div class="invalid-feedback">Enter a valid positive horsepower.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="create-color" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Color</label>
                        <input type="text" class="form-control" id="create-color" placeholder="e.g. Black" />
                    </div>
                    <div class="col-md-6">
                        <label for="create-location" class="form-label text-muted small fw-bold text-uppercase tracking-wide">Location (City)</label>
                        <input type="text" class="form-control" id="create-location" placeholder="e.g. Sofia" />
                    </div>
                </div>
            </div>

            <!-- Section 2: Description -->
            <div class="card-am-static p-4 p-md-5 mb-4 anim-slide-up delay-200" style="box-shadow: var(--am-shadow-md);">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="section-header mb-0">
                        <div class="section-icon"><i class="bi bi-text-paragraph"></i></div>
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 700;">Description</h3>
                            <span class="section-subtitle">Provide details that will help buyers</span>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" id="btn-improve-description" class="btn btn-sm btn-am-accent hover-glow" title="Improve current description with AI" style="border-radius: var(--am-radius-full); padding: 0.4rem 1rem;">
                            ✨ Improve Description
                        </button>
                        <button type="button" id="btn-generate-description" class="btn btn-sm btn-am-primary hover-glow" title="Generate description with AI" style="border-radius: var(--am-radius-full); padding: 0.4rem 1rem;">
                            🤖 Generate Description
                        </button>
                    </div>
                </div>
                <textarea class="form-control form-control-lg" id="create-description" rows="6" placeholder="Describe your vehicle — condition, features, service history, reason for selling..." style="resize: vertical;"></textarea>
            </div>

            <!-- Section 3: Images -->
            <div class="card-am-static p-4 p-md-5 mb-4 anim-slide-up delay-300" style="box-shadow: var(--am-shadow-md);">
                <div class="section-header mb-4">
                    <div class="section-icon"><i class="bi bi-images"></i></div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Photos</h3>
                        <span class="section-subtitle">Upload up to 10 high-quality images</span>
                    </div>
                </div>
                <div id="image-dropzone" style="border: 2px dashed #cbd5e1; border-radius: var(--am-radius-lg); padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.3s ease; background: var(--am-light);">
                    <div style="width: 80px; height: 80px; background: var(--am-white); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: var(--am-shadow-sm);">
                        <i class="bi bi-cloud-arrow-up" style="font-size: 2.5rem; color: var(--am-primary);"></i>
                    </div>
                    <h4 style="color: var(--am-dark-800); font-weight: 600; margin-bottom: 0.5rem;">
                        Drag & drop images here
                    </h4>
                    <p style="color: var(--am-gray); margin-bottom: 1.5rem;">or click to browse from your device</p>
                    <small style="color: var(--am-gray-light); display: block; margin-bottom: 1rem;">JPG, PNG, WebP up to 5MB each. First image is the cover.</small>
                    <input class="form-control" type="file" id="create-images" multiple accept="image/*" style="max-width: 350px; margin: 0 auto; border-radius: var(--am-radius-full);" />
                </div>
                <div id="images-preview" class="d-flex gap-3 flex-wrap mt-4"></div>
            </div>

            <!-- Actions -->
            <div class="card-am-static p-4 p-md-5 d-flex flex-column flex-sm-row justify-content-between align-items-center anim-slide-up delay-400 gap-3" style="background: var(--am-primary-50); border: 1px solid var(--am-primary-200); box-shadow: var(--am-shadow-md);">
                <a href="#/browse" class="btn btn-am-outline" style="border-radius: var(--am-radius-full); padding: 0.7rem 1.5rem;">
                    <i class="bi bi-arrow-left me-2"></i>Cancel
                </a>
                <button type="submit" class="btn btn-am-primary btn-lg hover-glow" id="submit-create-btn" style="border-radius: var(--am-radius-full); padding: 0.8rem 2.5rem; font-size: 1.1rem;">
                    <i class="bi bi-rocket-takeoff me-2"></i>Publish Listing
                </button>
            </div>

        </form>
    </div>`;
}

/**
 * Initialize the create page.
 */
export function initCreatePage() {
    const form = document.getElementById('create-listing-form');
    if (!form) return;

    form.addEventListener('submit', handleCreateSubmit);

    // Dropzone visual effects
    const dropzone = document.getElementById('image-dropzone');
    if (dropzone) {
        dropzone.addEventListener('mouseover', () => {
            dropzone.style.borderColor = 'var(--am-primary-200)';
            dropzone.style.background = 'var(--am-primary-50)';
        });
        dropzone.addEventListener('mouseout', () => {
            dropzone.style.borderColor = '#e2e8f0';
            dropzone.style.background = 'transparent';
        });
    }

    // Basic image preview and validation
    const imageInput = document.getElementById('create-images');
    const previewContainer = document.getElementById('images-preview');
    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', () => {
            previewContainer.innerHTML = '';
            const files = Array.from(imageInput.files);
            
            const validationError = validateImageFiles(files, 0);
            if (validationError) {
                showToast(validationError, 'danger');
                imageInput.value = ''; // clear input
                return;
            }

            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const isCover = index === 0;
                    previewContainer.innerHTML += `
                        <div style="width: 100px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid ${isCover ? 'var(--am-primary)' : '#e2e8f0'}; position: relative;">
                            ${isCover ? '<div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(37,99,235,0.9); color: white; font-size: 0.6rem; text-align: center; padding: 2px;">COVER</div>' : ''}
                            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
                        </div>`;
                };
                reader.readAsDataURL(file);
            });
        });
    }

    // AI Generate Description logic
    const btnGenerateDescription = document.getElementById('btn-generate-description');
    if (btnGenerateDescription) {
        btnGenerateDescription.addEventListener('click', async () => {
            const brand = document.getElementById('create-brand').value.trim();
            const model = document.getElementById('create-model').value.trim();
            const year = document.getElementById('create-year').value.trim();
            const mileage = document.getElementById('create-mileage').value.trim();
            const fuel = document.getElementById('create-fuel_type').value;
            const transmission = document.getElementById('create-transmission').value;
            const horsepower = document.getElementById('create-horsepower').value.trim();
            const color = document.getElementById('create-color').value.trim();
            const price = document.getElementById('create-price').value.trim();

            // We need at least some basic info to generate a good description
            if (!brand || !model || !year) {
                showToast('Please fill in Brand, Model, and Year to generate a description.', 'warning');
                return;
            }

            btnGenerateDescription.disabled = true;
            btnGenerateDescription.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Generating...';

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

                document.getElementById('create-description').value = generatedText;
                showToast('Description generated successfully!', 'success');
            } catch (err) {
                console.error(err);
                showToast('Failed to generate description.', 'danger');
            } finally {
                btnGenerateDescription.disabled = false;
                btnGenerateDescription.innerHTML = '🤖 Generate Description';
            }
        });
    }

    // AI Improve Description logic
    const btnImproveDescription = document.getElementById('btn-improve-description');
    if (btnImproveDescription) {
        btnImproveDescription.addEventListener('click', async () => {
            const descriptionArea = document.getElementById('create-description');
            const currentDesc = descriptionArea.value.trim();
            if (!currentDesc) {
                showToast('Please write some description first before improving.', 'warning');
                return;
            }

            btnImproveDescription.disabled = true;
            btnImproveDescription.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Improving...';

            try {
                const { improveDescription } = await import('../../services/aiService.js');
                const improvedText = await improveDescription(currentDesc);
                descriptionArea.value = improvedText;
                showToast('Description improved successfully!', 'success');
            } catch (err) {
                console.error(err);
                showToast('Failed to improve description.', 'danger');
            } finally {
                btnImproveDescription.disabled = false;
                btnImproveDescription.innerHTML = '✨ Improve Description';
            }
        });
    }
}

/**
 * Validate image files.
 * @param {File[]} files 
 * @param {number} currentCount 
 * @returns {string|null} Error message or null
 */
export function validateImageFiles(files, currentCount = 0) {
    if (files.length + currentCount > 10) {
        return `You can only upload a total of 10 images.`;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
        if (!validTypes.includes(file.type)) {
            return `File "${file.name}" has an invalid format. Only JPG, PNG, and WebP are allowed.`;
        }
        if (file.size > maxSize) {
            return `File "${file.name}" is too large. Maximum size is 5MB.`;
        }
    }
    return null;
}

/**
 * Handle form submission.
 * @param {SubmitEvent} e
 */
async function handleCreateSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Client-side validation
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const submitBtn = document.getElementById('submit-create-btn');
    const user = getUser();

    if (!user) {
        showToast('You must be logged in to create a listing.', 'danger');
        return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Publishing...';

    // Gather data
    const imageInput = document.getElementById('create-images');
    const files = Array.from(imageInput.files);
    
    // Validate images before creating the listing record
    const validationError = validateImageFiles(files, 0);
    if (validationError) {
        showToast(validationError, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
        return;
    }

    const yearVal = parseInt(document.getElementById('create-year').value, 10);
    const currentYear = new Date().getFullYear();
    if (yearVal < 1885 || yearVal > currentYear) {
        showToast(`Year must be between 1885 and ${currentYear}.`, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
        return;
    }

    const priceVal = parseFloat(document.getElementById('create-price').value);
    if (priceVal <= 0) {
        showToast('Price must be a positive number.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
        return;
    }

    const mileageStr = document.getElementById('create-mileage').value;
    if (mileageStr && parseFloat(mileageStr) <= 0) {
        showToast('Mileage must be a positive number.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
        return;
    }

    const hpStr = document.getElementById('create-horsepower').value;
    if (hpStr && parseFloat(hpStr) <= 0) {
        showToast('Horsepower must be a positive number.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
        return;
    }

    const listingData = {
        seller_id: user.id,
        title: document.getElementById('create-title').value.trim(),
        brand: document.getElementById('create-brand').value.trim(),
        model: document.getElementById('create-model').value.trim(),
        year: parseInt(document.getElementById('create-year').value, 10),
        price: parseFloat(document.getElementById('create-price').value),
        mileage: parseInt(document.getElementById('create-mileage').value, 10) || null,
        fuel_type: document.getElementById('create-fuel_type').value || null,
        transmission: document.getElementById('create-transmission').value || null,
        engine: document.getElementById('create-engine').value.trim() || null,
        horsepower: parseInt(document.getElementById('create-horsepower').value, 10) || null,
        color: document.getElementById('create-color').value.trim() || null,
        location: document.getElementById('create-location').value.trim() || null,
        description: document.getElementById('create-description').value.trim() || null,
        status: 'active'
    };

    try {
        // 1. Create the listing record
        const { data: newListing, error: createError } = await createListing(listingData);

        if (createError) {
            throw createError;
        }

        if (files.length > 0) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Uploading images...';
            const { failed } = await uploadMultipleImages(newListing.id, files);
            if (failed.length > 0) {
                console.warn('Some images failed to upload:', failed);
                showToast('Some images failed to upload.', 'warning');
            }
        }

        showToast('Listing published successfully!', 'success');
        
        setTimeout(() => {
            navigateTo('/profile');
        }, 1500);

    } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to create listing. Please try again.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
    }
}
