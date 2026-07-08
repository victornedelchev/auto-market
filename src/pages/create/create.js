/**
 * Create Listing page.
 * Premium multi-step style form with sections, icons, and visual cues.
 */

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
            <form id="create-listing-form">
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
                            <label for="create-title" class="form-label">Listing Title</label>
                            <input type="text" class="form-control" id="create-title" placeholder="e.g. BMW X5 M Sport 2022" required />
                        </div>
                        <div class="col-md-3">
                            <label for="create-make" class="form-label">Make</label>
                            <select class="form-select" id="create-make" required>
                                <option value="">Select make</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="create-model" class="form-label">Model</label>
                            <input type="text" class="form-control" id="create-model" placeholder="e.g. X5" required />
                        </div>
                        <div class="col-md-3">
                            <label for="create-year" class="form-label">Year</label>
                            <input type="number" class="form-control" id="create-year" placeholder="2022" required />
                        </div>
                        <div class="col-md-3">
                            <label for="create-price" class="form-label">Price (&euro;)</label>
                            <input type="number" class="form-control" id="create-price" placeholder="45000" required />
                        </div>
                        <div class="col-md-3">
                            <label for="create-mileage" class="form-label">Mileage (km)</label>
                            <input type="number" class="form-control" id="create-mileage" placeholder="32000" required />
                        </div>
                        <div class="col-md-3">
                            <label for="create-fuel" class="form-label">Fuel Type</label>
                            <select class="form-select" id="create-fuel" required>
                                <option value="">Select</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="create-transmission" class="form-label">Transmission</label>
                            <select class="form-select" id="create-transmission" required>
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
                            <label for="create-color" class="form-label">Color</label>
                            <input type="text" class="form-control" id="create-color" placeholder="e.g. Black" />
                        </div>
                        <div class="col-md-3">
                            <label for="create-location" class="form-label">Location</label>
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
                    <div style="border: 2px dashed #e2e8f0; border-radius: var(--am-radius); padding: 2.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease;"
                         onmouseover="this.style.borderColor='var(--am-primary-200)'; this.style.background='var(--am-primary-50)'"
                         onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='transparent'">
                        <i class="bi bi-cloud-arrow-up" style="font-size: 2.5rem; color: var(--am-primary-light);"></i>
                        <p style="color: var(--am-dark-600); font-weight: 500; margin: 0.75rem 0 0.25rem;">
                            Drag & drop images here or click to browse
                        </p>
                        <small style="color: var(--am-gray-light);">JPG, PNG up to 5MB each · First image will be the cover</small>
                        <input class="form-control mt-3" type="file" id="create-images" multiple accept="image/*" style="max-width: 300px; margin: 0 auto;" />
                    </div>
                </div>

                <!-- Actions -->
                <div class="p-4 d-flex justify-content-between align-items-center">
                    <a href="#/browse" class="btn btn-am-outline">
                        <i class="bi bi-x-lg me-1"></i>Cancel
                    </a>
                    <button type="submit" class="btn btn-am-primary btn-lg px-4">
                        <i class="bi bi-rocket-takeoff me-2"></i>Publish Listing
                    </button>
                </div>
            </form>
        </div>
    </div>`;
}
