/**
 * Admin Dashboard page.
 * Premium admin panel with sidebar, stat cards, and styled activity table.
 */
import { renderSidebar } from '../../components/sidebar/sidebar.js';

/**
 * Render the admin dashboard page.
 * @returns {string} The page markup.
 */
export function renderAdminPage() {
    return `
    <div class="d-flex" style="min-height: calc(100vh - 73px);">
        ${renderSidebar()}

        <div class="flex-grow-1" style="background: var(--am-light); padding: 2rem;">
            <!-- Admin Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; margin: 0;">Dashboard</h1>
                    <p style="color: var(--am-gray); font-size: 0.9rem; margin: 0;">Welcome back, Admin</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="d-flex align-items-center gap-1" style="font-size: 0.85rem; color: var(--am-gray);">
                        <span class="pulse-dot"></span> Live
                    </span>
                </div>
            </div>

            <!-- Stats -->
            <div class="row g-3 mb-4">
                <div class="col-md-6 col-xl-3">
                    <div class="card-am-static p-4" style="border-left: 4px solid var(--am-primary);">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p style="color: var(--am-gray); font-size: 0.82rem; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;">Total Listings</p>
                                <h3 style="font-family: var(--am-font-display); font-weight: 800; margin: 0;">1,247</h3>
                                <span style="font-size: 0.78rem; color: var(--am-success); font-weight: 500;">
                                    <i class="bi bi-arrow-up me-1"></i>12% this month
                                </span>
                            </div>
                            <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--am-primary-100); color: var(--am-primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                                <i class="bi bi-card-list"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3">
                    <div class="card-am-static p-4" style="border-left: 4px solid var(--am-success);">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p style="color: var(--am-gray); font-size: 0.82rem; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;">Total Users</p>
                                <h3 style="font-family: var(--am-font-display); font-weight: 800; margin: 0;">5,032</h3>
                                <span style="font-size: 0.78rem; color: var(--am-success); font-weight: 500;">
                                    <i class="bi bi-arrow-up me-1"></i>8% this month
                                </span>
                            </div>
                            <div style="width: 48px; height: 48px; border-radius: 12px; background: #d1fae5; color: var(--am-success); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                                <i class="bi bi-people"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3">
                    <div class="card-am-static p-4" style="border-left: 4px solid var(--am-warning);">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p style="color: var(--am-gray); font-size: 0.82rem; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;">Pending Reviews</p>
                                <h3 style="font-family: var(--am-font-display); font-weight: 800; margin: 0;">18</h3>
                                <span style="font-size: 0.78rem; color: var(--am-warning); font-weight: 500;">
                                    <i class="bi bi-exclamation-triangle me-1"></i>Needs attention
                                </span>
                            </div>
                            <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef3c7; color: var(--am-warning); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                                <i class="bi bi-clock-history"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3">
                    <div class="card-am-static p-4" style="border-left: 4px solid var(--am-danger);">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p style="color: var(--am-gray); font-size: 0.82rem; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;">Reports</p>
                                <h3 style="font-family: var(--am-font-display); font-weight: 800; margin: 0;">3</h3>
                                <span style="font-size: 0.78rem; color: var(--am-danger); font-weight: 500;">
                                    <i class="bi bi-flag me-1"></i>2 new today
                                </span>
                            </div>
                            <div style="width: 48px; height: 48px; border-radius: 12px; background: #fee2e2; color: var(--am-danger); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                                <i class="bi bi-flag"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Table -->
            <div class="card-am-static">
                <div class="p-4 d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #e2e8f0;">
                    <div class="section-header mb-0">
                        <div class="section-icon"><i class="bi bi-activity"></i></div>
                        <h3 style="font-size: 1.15rem; margin: 0;">Recent Activity</h3>
                    </div>
                    <button class="btn btn-sm btn-am-outline" style="font-size: 0.82rem;">View All</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-am mb-0">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>Listing</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; font-weight: 700;">JD</div>
                                        <span style="font-weight: 500;">John Doe</span>
                                    </div>
                                </td>
                                <td><span style="color: var(--am-dark-600);">Created listing</span></td>
                                <td><a href="#/details/1" style="color: var(--am-primary); text-decoration: none; font-weight: 500;">BMW X5 M Sport</a></td>
                                <td style="color: var(--am-gray);">Today, 14:23</td>
                                <td><span class="badge-am badge-am-success">Approved</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #ef4444); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; font-weight: 700;">JS</div>
                                        <span style="font-weight: 500;">Jane Smith</span>
                                    </div>
                                </td>
                                <td><span style="color: var(--am-dark-600);">Reported listing</span></td>
                                <td><a href="#" style="color: var(--am-primary); text-decoration: none; font-weight: 500;">Suspicious Ad</a></td>
                                <td style="color: var(--am-gray);">Yesterday, 09:15</td>
                                <td><span class="badge-am badge-am-warning">Pending</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #3b82f6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; font-weight: 700;">AJ</div>
                                        <span style="font-weight: 500;">Alex Johnson</span>
                                    </div>
                                </td>
                                <td><span style="color: var(--am-dark-600);">Updated listing</span></td>
                                <td><a href="#/details/5" style="color: var(--am-primary); text-decoration: none; font-weight: 500;">Tesla Model 3</a></td>
                                <td style="color: var(--am-gray);">Jul 6, 17:30</td>
                                <td><span class="badge-am badge-am-info">Updated</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
}
