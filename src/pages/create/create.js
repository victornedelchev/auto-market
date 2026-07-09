/**
 * Create Listing page.
 * Premium multi-step style form with sections, icons, and visual cues.
 */
import { createListing } from '../../services/listingService.js';
import { uploadMultipleImages } from '../../services/storageService.js';
import { navigateTo } from '../../utils/router.js';
import { getUser } from '../../utils/authState.js';

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

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2; margin-bottom: 2rem;">
        <div class="card-am-static">
            <div id="create-alert" class="m-4 mb-0"></div>
            <form id="create-listing-form" class="needs-validation" novalidate>
                <!-- Section 1: Vehicle Info -->
                <div class="p-4" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-car-front"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">Vehicle Information</h3>
                            <span class="section-subtitle">Tell us about your car</span>
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="create-title" class="form-label">Listing Title *</label>
                            <input type="text" class="form-control" id="create-title" placeholder="e.g. BMW X5 M Sport 2022" required />
                            <div class="invalid-feedback">Please enter a title.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="create-brand" class="form-label">Make (Brand) *</label>
                            <input type="text" class="form-control" id="create-brand" placeholder="e.g. BMW" required />
                            <div class="invalid-feedback">Please enter a brand.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="create-model" class="form-label">Model *</label>
                            <input type="text" class="form-control" id="create-model" placeholder="e.g. X5" required />
                            <div class="invalid-feedback">Please enter a model.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="create-year" class="form-label">Year *</label>
                            <input type="number" class="form-control" id="create-year" placeholder="2022" min="1900" max="${new Date().getFullYear() + 1}" required />
                            <div class="invalid-feedback">Enter a valid year.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="create-price" class="form-label">Price (&euro;) *</label>
                            <input type="number" class="form-control" id="create-price" placeholder="45000" min="1" required />
                            <div class="invalid-feedback">Enter a valid price.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="create-mileage" class="form-label">Mileage (km)</label>
                            <input type="number" class="form-control" id="create-mileage" placeholder="32000" min="0" />
                        </div>
                        <div class="col-md-3">
                            <label for="create-fuel_type" class="form-label">Fuel Type</label>
                            <select class="form-select" id="create-fuel_type">
                                <option value="">Select</option>
                                <option value="gasoline">Petrol / Gasoline</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="lpg">LPG</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="create-transmission" class="form-label">Transmission</label>
                            <select class="form-select" id="create-transmission">
                                <option value="">Select</option>
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="create-engine" class="form-label">Engine</label>
                            <input type="text" class="form-control" id="create-engine" placeholder="e.g. 3.0L Turbo" />
                        </div>
                        <div class="col-md-3">
                            <label for="create-horsepower" class="form-label">Horsepower (HP)</label>
                            <input type="number" class="form-control" id="create-horsepower" placeholder="e.g. 300" min="1" />
                        </div>
                        <div class="col-md-3">
                            <label for="create-color" class="form-label">Color</label>
                            <input type="text" class="form-control" id="create-color" placeholder="e.g. Black" />
                        </div>
                        <div class="col-md-3">
                            <label for="create-location" class="form-label">Location (City)</label>
                            <input type="text" class="form-control" id="create-location" placeholder="e.g. Sofia" />
                        </div>
                    </div>
                </div>

                <!-- Section 2: Description -->
                <div class="p-4" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-text-paragraph"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">Description</h3>
                            <span class="section-subtitle">Provide details that will help buyers</span>
                        </div>
                    </div>
                    <textarea class="form-control" id="create-description" rows="5" placeholder="Describe your vehicle — condition, features, service history, reason for selling..."></textarea>
                </div>

                <!-- Section 3: Images -->
                <div class="p-4" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-images"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">Photos</h3>
                            <span class="section-subtitle">Upload up to 10 high-quality images</span>
                        </div>
                    </div>
                    <div id="image-dropzone" style="border: 2px dashed #e2e8f0; border-radius: var(--am-radius); padding: 2.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                        <i class="bi bi-cloud-arrow-up" style="font-size: 2.5rem; color: var(--am-primary-light);"></i>
                        <p style="color: var(--am-dark-600); font-weight: 500; margin: 0.75rem 0 0.25rem;">
                            Drag & drop images here or click to browse
                        </p>
                        <small style="color: var(--am-gray-light);">JPG, PNG up to 5MB each · First image will be the cover</small>
                        <input class="form-control mt-3" type="file" id="create-images" multiple accept="image/*" style="max-width: 300px; margin: 0 auto;" />
                    </div>
                    <div id="images-preview" class="d-flex gap-2 flex-wrap mt-3"></div>
                </div>

                <!-- Actions -->
                <div class="p-4 d-flex justify-content-between align-items-center">
                    <a href="#/browse" class="btn btn-am-outline">
                        <i class="bi bi-x-lg me-1"></i>Cancel
                    </a>
                    <button type="submit" class="btn btn-am-primary btn-lg px-4" id="submit-create-btn">
                        <i class="bi bi-rocket-takeoff me-2"></i>Publish Listing
                    </button>
                </div>
            </form>
        </div>
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
                const alertBox = document.getElementById('create-alert');
                if (alertBox) showAlert(alertBox, 'danger', validationError);
                imageInput.value = ''; // clear input
                return;
            } else {
                const alertBox = document.getElementById('create-alert');
                if (alertBox) alertBox.innerHTML = ''; // Clear previous error
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

    const alertBox = document.getElementById('create-alert');
    const submitBtn = document.getElementById('submit-create-btn');
    const user = getUser();

    if (!user) {
        showAlert(alertBox, 'danger', 'You must be logged in to create a listing.');
        return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Publishing...';
    alertBox.innerHTML = '';

    // Gather data
    const imageInput = document.getElementById('create-images');
    const files = Array.from(imageInput.files);
    
    // Validate images before creating the listing record
    const validationError = validateImageFiles(files, 0);
    if (validationError) {
        showAlert(alertBox, 'danger', validationError);
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

        // 2. Upload images if any
        if (files.length > 0) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Uploading images...';
            const { failed } = await uploadMultipleImages(newListing.id, files);
            if (failed.length > 0) {
                console.warn('Some images failed to upload:', failed);
            }
        }

        showAlert(alertBox, 'success', 'Listing published successfully! Redirecting...');
        
        setTimeout(() => {
            navigateTo('/profile');
        }, 1500);

    } catch (err) {
        console.error(err);
        showAlert(alertBox, 'danger', err.message || 'Failed to create listing. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Publish Listing';
    }
}

/**
 * Display a Bootstrap alert.
 */
function showAlert(container, type, message) {
    if (!container) return;
    const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    container.innerHTML = `
        <div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show mb-4" role="alert">
            <i class="bi ${icon} me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
}
