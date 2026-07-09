/**
 * Edit Listing page.
 * Premium edit form mirroring the create page style with delete action.
 */
import { getListingById, updateListing, deleteListing } from '../../services/listingService.js';
import { listImages, getPublicUrl, uploadMultipleImages, deleteImage } from '../../services/storageService.js';
import { navigateTo } from '../../utils/router.js';
import { getUser } from '../../utils/authState.js';
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
                            <label for="edit-title" class="form-label">Listing Title *</label>
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
                            <input type="number" class="form-control" id="edit-year" min="1900" max="${new Date().getFullYear() + 1}" required />
                            <div class="invalid-feedback">Enter a valid year.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-price" class="form-label">Price (&euro;) *</label>
                            <input type="number" class="form-control" id="edit-price" min="1" required />
                            <div class="invalid-feedback">Enter a valid price.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-mileage" class="form-label">Mileage (km)</label>
                            <input type="number" class="form-control" id="edit-mileage" min="0" />
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
                            <input type="number" class="form-control" id="edit-horsepower" min="1" />
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
                    <div class="section-header">
                        <div class="section-icon"><i class="bi bi-text-paragraph"></i></div>
                        <div>
                            <h3 style="font-size: 1.15rem;">Description</h3>
                            <span class="section-subtitle">Update your car's description</span>
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

                    <div id="edit-image-dropzone" style="border: 2px dashed #e2e8f0; border-radius: var(--am-radius); padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                        <i class="bi bi-cloud-arrow-up" style="font-size: 1.8rem; color: var(--am-primary-light);"></i>
                        <p style="color: var(--am-dark-600); font-weight: 500; font-size: 0.9rem; margin: 0.5rem 0 0.25rem;">Upload additional images</p>
                        <input class="form-control mt-2" type="file" id="edit-images" multiple accept="image/*" style="max-width: 280px; margin: 0 auto;" />
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
        if (listing.seller_id !== user.id) {
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

        // Image dropzone UX
        const dropzone = document.getElementById('edit-image-dropzone');
        const imageInput = document.getElementById('edit-images');
        const previewContainer = document.getElementById('edit-images-preview');
        
        dropzone.addEventListener('mouseover', () => {
            dropzone.style.borderColor = 'var(--am-primary-200)';
            dropzone.style.background = 'var(--am-primary-50)';
        });
        dropzone.addEventListener('mouseout', () => {
            dropzone.style.borderColor = '#e2e8f0';
            dropzone.style.background = 'transparent';
        });

        imageInput.addEventListener('change', () => {
            previewContainer.innerHTML = '';
            const files = Array.from(imageInput.files);
            
            const validationError = validateImageFiles(files, currentImageCount);
            if (validationError) {
                showToast(validationError, 'danger');
                imageInput.value = ''; // clear input
                return;
            }

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewContainer.innerHTML += `
                        <div style="width: 100px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
                        </div>`;
                };
                reader.readAsDataURL(file);
            });
        });

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
                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-1" aria-label="Delete image" style="background-color: rgba(220, 53, 69, 0.8); width: 0.5rem; height: 0.5rem;" data-path="${filePath}" onclick="window.handleDeleteImage('${filePath}', '${listingId}')"></button>
            </div>
        `;
    }).join('');
}

/**
 * Handle deleting a single image. Exposed globally for inline onclick.
 */
window.handleDeleteImage = async (filePath, listingId) => {
    if (!confirm('Delete this image permanently?')) return;
    
    const { error } = await deleteImage(filePath);
    if (error) {
        showToast('Failed to delete image: ' + error.message, 'danger');
        return;
    }
    
    // Refresh images
    await renderExistingImages(listingId);
};

/**
 * Handle listing deletion.
 */
async function handleDeleteListing(id) {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        return;
    }

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
