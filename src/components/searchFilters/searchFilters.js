/**
 * Search Filters component.
 * Premium filter panel with collapsible advanced options and styled controls.
 */

/**
 * Render search filter controls.
 * @returns {string} The search filters markup.
 */
export function renderSearchFilters() {
    return `
    <div class="card-am-static mb-4" style="overflow: visible;">
        <div class="p-4">
            <!-- Quick Search Bar -->
            <div class="d-flex align-items-center gap-3 mb-3">
                <div class="flex-grow-1 position-relative">
                    <i class="bi bi-search" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--am-gray-light); font-size: 1.1rem;"></i>
                    <input type="text" class="form-control" id="filter-keyword"
                           placeholder="Search by make, model, or keyword..."
                           style="padding-left: 2.8rem; height: 48px; font-size: 1rem;" />
                </div>
                <button type="button" class="btn btn-am-primary" style="height: 48px; padding: 0 1.5rem; white-space: nowrap;">
                    <i class="bi bi-search me-1"></i>Search
                </button>
            </div>

            <!-- Toggleable Advanced Filters -->
            <button class="btn btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#advancedFilters"
                    style="color: var(--am-primary); font-weight: 500; font-size: 0.85rem; padding: 0;">
                <i class="bi bi-sliders me-1"></i>Advanced Filters
                <i class="bi bi-chevron-down ms-1" style="font-size: 0.75rem;"></i>
            </button>

            <div class="collapse mt-3" id="advancedFilters">
                <form id="search-filters-form">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label for="filter-make" class="form-label">Make</label>
                            <select class="form-select" id="filter-make">
                                <option value="">All Makes</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="filter-model" class="form-label">Model</label>
                            <select class="form-select" id="filter-model">
                                <option value="">All Models</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="filter-year-min" class="form-label">Year From</label>
                            <input type="number" class="form-control" id="filter-year-min" placeholder="2010" />
                        </div>
                        <div class="col-md-3">
                            <label for="filter-year-max" class="form-label">Year To</label>
                            <input type="number" class="form-control" id="filter-year-max" placeholder="2025" />
                        </div>
                        <div class="col-md-3">
                            <label for="filter-price-min" class="form-label">Price Min (&euro;)</label>
                            <input type="number" class="form-control" id="filter-price-min" placeholder="0" />
                        </div>
                        <div class="col-md-3">
                            <label for="filter-price-max" class="form-label">Price Max (&euro;)</label>
                            <input type="number" class="form-control" id="filter-price-max" placeholder="100,000" />
                        </div>
                        <div class="col-md-3">
                            <label for="filter-fuel" class="form-label">Fuel Type</label>
                            <select class="form-select" id="filter-fuel">
                                <option value="">All</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="filter-transmission" class="form-label">Transmission</label>
                            <select class="form-select" id="filter-transmission">
                                <option value="">All</option>
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-3 mt-3 pt-3" style="border-top: 1px solid #e2e8f0;">
                        <div style="flex: 0 0 200px;">
                            <label for="filter-sort" class="form-label" style="margin-bottom: 0; font-size: 0.8rem;">Sort by</label>
                            <select class="form-select form-select-sm" id="filter-sort">
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="mileage-asc">Mileage: Low → High</option>
                            </select>
                        </div>
                        <div class="ms-auto d-flex gap-2">
                            <button type="reset" class="btn btn-sm" style="color: var(--am-gray); font-weight: 500;">
                                <i class="bi bi-x-lg me-1"></i>Clear
                            </button>
                            <button type="submit" class="btn btn-am-primary btn-sm">
                                <i class="bi bi-funnel me-1"></i>Apply Filters
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}
