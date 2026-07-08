/**
 * Edit Listing page.
 * Premium edit form mirroring the create page style with delete action.
 */

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
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;">Update listing #${id}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 2; margin-bottom: 2rem;">
        <div class="card-am-static">
            <form id="edit-listing-form" data-listing-id="${id}">
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
                            <label for="edit-title" class="form-label">Listing Title</label>
                            <input type="text" class="form-control" id="edit-title" required />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-make" class="form-label">Make</label>
                            <select class="form-select" id="edit-make" required>
                                <option value="">Select make</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-model" class="form-label">Model</label>
                            <input type="text" class="form-control" id="edit-model" required />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-year" class="form-label">Year</label>
                            <input type="number" class="form-control" id="edit-year" required />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-price" class="form-label">Price (&euro;)</label>
                            <input type="number" class="form-control" id="edit-price" required />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-mileage" class="form-label">Mileage (km)</label>
                            <input type="number" class="form-control" id="edit-mileage" required />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-fuel" class="form-label">Fuel Type</label>
                            <select class="form-select" id="edit-fuel" required>
                                <option value="">Select</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="edit-transmission" class="form-label">Transmission</label>
                            <select class="form-select" id="edit-transmission" required>
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
                            <label for="edit-color" class="form-label">Color</label>
                            <input type="text" class="form-control" id="edit-color" />
                        </div>
                        <div class="col-md-3">
                            <label for="edit-location" class="form-label">Location</label>
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
                    <div id="edit-existing-images" class="mb-3">
                        <div class="d-flex gap-2 flex-wrap">
                            <div style="width: 100px; height: 80px; border-radius: 8px; background: var(--am-light); display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0;">
                                <i class="bi bi-image" style="color: var(--am-gray-light); font-size: 1.5rem;"></i>
                            </div>
                            <div style="width: 100px; height: 80px; border-radius: 8px; background: var(--am-light); display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0;">
                                <i class="bi bi-image" style="color: var(--am-gray-light); font-size: 1.5rem;"></i>
                            </div>
                        </div>
                        <small style="color: var(--am-gray-light); display: block; margin-top: 0.5rem;">Existing images will load from Supabase</small>
                    </div>

                    <div style="border: 2px dashed #e2e8f0; border-radius: var(--am-radius); padding: 1.5rem; text-align: center;">
                        <i class="bi bi-cloud-arrow-up" style="font-size: 1.8rem; color: var(--am-primary-light);"></i>
                        <p style="color: var(--am-dark-600); font-weight: 500; font-size: 0.9rem; margin: 0.5rem 0 0.25rem;">Upload additional images</p>
                        <input class="form-control mt-2" type="file" id="edit-images" multiple accept="image/*" style="max-width: 280px; margin: 0 auto;" />
                    </div>
                </div>

                <!-- Actions -->
                <div class="p-4 d-flex justify-content-between align-items-center">
                    <button type="button" class="btn" id="btn-delete-listing" style="color: var(--am-danger); font-weight: 500;">
                        <i class="bi bi-trash3 me-1"></i>Delete Listing
                    </button>
                    <div class="d-flex gap-2">
                        <a href="#/details/${id}" class="btn btn-am-outline">Cancel</a>
                        <button type="submit" class="btn btn-am-primary px-4">
                            <i class="bi bi-check-lg me-2"></i>Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>`;
}
