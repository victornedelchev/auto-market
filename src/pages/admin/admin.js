/**
 * Admin Dashboard page.
 */
import { renderSidebar } from '../../components/sidebar/sidebar.js';
import { getAdminStats, getAllUsers, deactivateUser, activateUser, setRole, deleteUser, updateUserProfile } from '../../services/adminService.js';
import { getListings, deleteListing } from '../../services/listingService.js';
import { showToast } from '../../utils/toastService.js';
import { showConfirmModal } from '../../utils/modalService.js';
import { getListingImageUrls, deleteImage, uploadMultipleImages } from '../../services/storageService.js';
import { getUser } from '../../utils/authState.js';

let currentUsersPage = 1;
const USERS_PER_PAGE = 10;
let currentListingsPage = 1;
const LISTINGS_PER_PAGE = 10;

export function renderAdminPage() {
    return `
    <style>
        .admin-portal {
            background: var(--am-light);
            min-height: calc(100vh - 73px);
            padding-bottom: 4rem;
        }
        .admin-hero {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 1rem;
            padding: 3rem 2rem;
            color: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.5);
            margin-bottom: -3rem;
            z-index: 1;
        }
        .admin-hero::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
            border-radius: 50%;
        }
        .admin-hero::before {
            content: '';
            position: absolute;
            bottom: -50%;
            left: -10%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
            border-radius: 50%;
        }
        .admin-tabs-container {
            background: var(--am-white);
            backdrop-filter: blur(12px);
            border-radius: 1rem;
            padding: 0.5rem;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02);
            position: relative;
            z-index: 2;
            margin: 0 auto 2rem;
            display: inline-flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
        }
        .admin-tab {
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            color: var(--am-gray);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: transparent;
            border: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .admin-tab:hover {
            color: var(--am-dark);
            background: var(--am-primary-50);
        }
        .admin-tab.active {
            background: var(--am-white);
            color: var(--am-dark);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.02);
        }
        .admin-tab.active i {
            color: var(--am-primary);
        }
        .admin-stats-card {
            background: var(--am-white);
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid var(--am-gray-light);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            height: 100%;
        }
        .admin-stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
        }
        .admin-stats-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        .admin-stats-value {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--am-dark);
            line-height: 1;
            margin-bottom: 0.25rem;
            font-family: var(--am-font-display);
        }
        .admin-stats-label {
            color: var(--am-gray);
            font-weight: 500;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .admin-table-container {
            background: var(--am-white);
            border-radius: 1rem;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02);
        }
        .admin-table-container .table-responsive {
            border-radius: 1rem;
            padding-bottom: 5rem; /* Add padding to prevent dropdown clipping */
            margin-bottom: -5rem;
        }
        .table.admin-table th {
            background: var(--am-primary-50);
            color: var(--am-dark-600);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--am-gray-light);
        }
        .table.admin-table td {
            padding: 1rem 1.5rem;
            vertical-align: middle;
            color: var(--am-dark-700);
            border-bottom: 1px solid var(--am-primary-50);
        }
        .table.admin-table tr:last-child td {
            border-bottom: none;
        }
        .table.admin-table tbody tr {
            transition: background 0.2s;
        }
        .table.admin-table tbody tr:hover {
            background: var(--am-primary-50);
        }
        .badge-you-premium {
            background: var(--am-gradient-primary);
            color: white;
            padding: 0.5rem 0.85rem;
            border-radius: 2rem;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }
        .btn-action-premium {
            background: rgba(99, 102, 241, 0.08);
            color: var(--am-primary);
            border: 1px solid rgba(99, 102, 241, 0.2);
            padding: 0.4rem 0.85rem;
            border-radius: 0.75rem;
            font-weight: 600;
            transition: all 0.2s;
        }
        .btn-action-premium:hover {
            background: var(--am-primary);
            color: white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
    </style>

    <div class="admin-portal">
        <div class="container py-5">
            <!-- Hero Header -->
            <div class="admin-hero mb-5">
                <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 2.5rem; margin-bottom: 0.5rem; position: relative; z-index: 2;">Admin Control Center</h1>
                <p style="color: #cbd5e1; font-size: 1.1rem; margin: 0; position: relative; z-index: 2;">Manage your marketplace users, listings, and platform health.</p>
            </div>

            <!-- Custom Tabs -->
            <div class="text-center">
                <div class="admin-tabs-container nav" role="tablist">
                    <button class="admin-tab active" id="stats-tab" data-bs-toggle="pill" data-bs-target="#stats" type="button" role="tab">
                        <i class="bi bi-grid-1x2-fill"></i> Dashboard
                    </button>
                    <button class="admin-tab" id="users-tab" data-bs-toggle="pill" data-bs-target="#users" type="button" role="tab">
                        <i class="bi bi-people-fill"></i> Users
                    </button>
                    <button class="admin-tab" id="listings-tab" data-bs-toggle="pill" data-bs-target="#listings" type="button" role="tab">
                        <i class="bi bi-car-front-fill"></i> Listings
                    </button>
                </div>
            </div>

            <div class="tab-content" id="admin-tab-content">
                <!-- Dashboard Tab -->
                <div class="tab-pane fade show active" id="stats" role="tabpanel">
                    <div class="row g-4 mb-4" id="admin-stats-container">
                        <div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>
                    </div>
                </div>

                <!-- Users Tab -->
                <div class="tab-pane fade" id="users" role="tabpanel">
                    <div class="admin-table-container">
                        <div class="table-responsive">
                            <table class="table admin-table mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-users-tbody">
                                </tbody>
                            </table>
                        </div>
                        <div id="admin-users-pagination" class="d-flex justify-content-center py-3 border-top"></div>
                    </div>
                </div>

                <!-- Listings Tab -->
                <div class="tab-pane fade" id="listings" role="tabpanel">
                     <div class="admin-table-container">
                        <div class="table-responsive">
                            <table class="table admin-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Brand / Model</th>
                                        <th>Price</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-listings-tbody">
                                </tbody>
                            </table>
                        </div>
                        <div id="admin-listings-pagination" class="d-flex justify-content-center py-3 border-top"></div>
                    </div>
                </div>
            </div>
            
            <div id="admin-images-modal-container"></div>
            <div id="admin-edit-user-modal-container"></div>
        </div>
    </div>`;
}

export function initAdminPage() {
    loadStats();
    loadUsers();
    loadListings();

    // Event delegation for users table
    document.getElementById('admin-users-tbody')?.addEventListener('click', async (e) => {
        const toggleBtn = e.target.closest('.dropdown-toggle');
        if (toggleBtn) {
            import('bootstrap').then(({ Dropdown }) => {
                document.querySelectorAll('.dropdown-toggle.show').forEach(el => {
                    if (el !== toggleBtn) {
                        const d = Dropdown.getInstance(el);
                        if (d) d.hide();
                    }
                });
                const dropdown = Dropdown.getOrCreateInstance(toggleBtn);
                dropdown.toggle();
            });
            return;
        }

        const btn = e.target.closest('button');
        if (!btn) return;
        
        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');

        if (action === 'deactivate') {
            if (await showConfirmModal('Deactivate User', 'Are you sure you want to deactivate this user?')) {
                const { error } = await deactivateUser(id);
                if (error) showToast('Failed to deactivate user', 'danger');
                else { showToast('User deactivated', 'success'); loadUsers(currentUsersPage); }
            }
        } else if (action === 'activate') {
            if (await showConfirmModal('Activate User', 'Are you sure you want to activate this user?', 'Activate', 'success')) {
                const { error } = await activateUser(id);
                if (error) showToast('Failed to activate user', 'danger');
                else { showToast('User activated', 'success'); loadUsers(currentUsersPage); }
            }
        } else if (action === 'make-admin') {
            if (await showConfirmModal('Make Admin', 'Elevate this user to Administrator status?', 'Confirm', 'success')) {
                const { error } = await setRole(id, 'admin');
                if (error) showToast(error.message || 'Failed to update role', 'danger');
                else { showToast('User elevated to Admin', 'success'); loadUsers(currentUsersPage); }
            }
        } else if (action === 'make-user') {
            if (await showConfirmModal('Remove Admin', 'Remove Administrator status from this user?', 'Confirm', 'warning')) {
                const { error } = await setRole(id, 'user');
                if (error) showToast(error.message || 'Failed to update role', 'danger');
                else { showToast('Admin privileges removed', 'success'); loadUsers(currentUsersPage); }
            }
        } else if (action === 'delete') {
            if (await showConfirmModal('Delete User', 'Permanently delete this user, their profile, and all their listings? This action cannot be undone.', 'Delete Permanently', 'danger')) {
                const { error } = await deleteUser(id);
                if (error) showToast(error.message || 'Failed to delete user', 'danger');
                else { showToast('User permanently deleted', 'success'); loadUsers(currentUsersPage); loadStats(); }
            }
        } else if (action === 'edit') {
            const username = btn.getAttribute('data-username');
            const fullname = btn.getAttribute('data-fullname');
            openEditUserModal(id, username, fullname);
        }
    });

    // Event delegation for listings table
    document.getElementById('admin-listings-tbody')?.addEventListener('click', async (e) => {
        const toggleBtn = e.target.closest('.dropdown-toggle');
        if (toggleBtn) {
            import('bootstrap').then(({ Dropdown }) => {
                document.querySelectorAll('.dropdown-toggle.show').forEach(el => {
                    if (el !== toggleBtn) {
                        const d = Dropdown.getInstance(el);
                        if (d) d.hide();
                    }
                });
                const dropdown = Dropdown.getOrCreateInstance(toggleBtn);
                dropdown.toggle();
            });
            return;
        }

        const btn = e.target.closest('button');
        if (!btn) return;

        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');

        if (action === 'delete') {
            if (await showConfirmModal('Delete Listing', 'Permanently delete this listing?')) {
                const { error } = await deleteListing(id);
                if (error) showToast('Failed to delete listing', 'danger');
                else { showToast('Listing deleted', 'success'); loadListings(currentListingsPage); loadStats(); }
            }
        } else if (action === 'manage-images') {
            openManageImagesModal(id);
        }
    });
}

async function loadStats() {
    const container = document.getElementById('admin-stats-container');
    if (!container) return;

    const { data, error } = await getAdminStats();
    if (error || !data) {
        container.innerHTML = '<div class="alert alert-danger w-100">Failed to load statistics.</div>';
        return;
    }

    container.innerHTML = `
        <div class="col-md-4">
            <div class="admin-stats-card">
                <div class="d-flex flex-column">
                    <div class="admin-stats-icon text-primary bg-primary bg-opacity-10">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <h3 class="admin-stats-value">${data.users}</h3>
                    <p class="admin-stats-label">Total Users</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="admin-stats-card">
                <div class="d-flex flex-column">
                    <div class="admin-stats-icon text-success bg-success bg-opacity-10">
                        <i class="bi bi-car-front-fill"></i>
                    </div>
                    <h3 class="admin-stats-value">${data.listings}</h3>
                    <p class="admin-stats-label">Total Listings</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="admin-stats-card">
                <div class="d-flex flex-column">
                    <div class="admin-stats-icon text-info bg-info bg-opacity-10">
                        <i class="bi bi-images"></i>
                    </div>
                    <h3 class="admin-stats-value">${data.images}</h3>
                    <p class="admin-stats-label">Total Images</p>
                </div>
            </div>
        </div>
    `;
}

async function loadUsers(page = 1) {
    currentUsersPage = page;
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';

    const { data, count, error } = await getAllUsers({ page, limit: USERS_PER_PAGE });
    if (error || !data) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Failed to load users</td></tr>';
        return;
    }

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(user => {
        let role = 'user';
        if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
            role = user.user_roles[0].role;
        } else if (user.user_roles && !Array.isArray(user.user_roles)) {
            role = user.user_roles.role;
        }
        
        const isActive = user.is_active !== false; // defaults to true
        const currentUser = getUser();
        const isSelf = currentUser && user.id === currentUser.id;

        return `
            <tr>
                <td><small class="text-muted">${user.id.split('-')[0]}</small></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        ${user.avatar_url 
                            ? `<img src="${user.avatar_url}" alt="${user.username}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(0,0,0,0.1);">`
                            : `<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; font-weight: 700;">
                                ${(user.username || 'U')[0].toUpperCase()}
                               </div>`
                        }
                        <div>
                            <span style="font-weight: 500; display: block;">${user.username || 'Unknown'}</span>
                            <small class="text-muted" style="font-size: 0.75rem;">${user.full_name || ''}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${role === 'admin' ? 'bg-danger' : 'bg-secondary'}">${role}</span></td>
                <td>
                    ${isActive 
                        ? '<span class="badge bg-success">Active</span>' 
                        : '<span class="badge bg-danger">Deactivated</span>'}
                </td>
                <td class="text-end">
                    ${isSelf ? '<span class="badge badge-you-premium"><i class="bi bi-person-badge"></i> You</span>' : `
                    <div class="dropdown">
                        <button class="btn btn-sm btn-action-premium dropdown-toggle" type="button" aria-expanded="false">
                            Actions
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" style="border-radius: 0.75rem; overflow: hidden;">
                            <li><button class="dropdown-item" data-action="edit" data-id="${user.id}" data-username="${user.username || ''}" data-fullname="${user.full_name || ''}"><i class="bi bi-pencil me-2 text-primary"></i> Edit User</button></li>
                            ${role === 'admin' 
                                ? `<li><button class="dropdown-item" data-action="make-user" data-id="${user.id}"><i class="bi bi-shield-minus me-2 text-warning"></i> Remove Admin</button></li>`
                                : `<li><button class="dropdown-item" data-action="make-admin" data-id="${user.id}"><i class="bi bi-shield-plus me-2 text-success"></i> Make Admin</button></li>`
                            }
                            ${isActive
                                ? `<li><button class="dropdown-item" data-action="deactivate" data-id="${user.id}"><i class="bi bi-person-x me-2 text-warning"></i> Deactivate</button></li>`
                                : `<li><button class="dropdown-item" data-action="activate" data-id="${user.id}"><i class="bi bi-person-check me-2 text-success"></i> Activate</button></li>`
                            }
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item text-danger fw-medium" data-action="delete" data-id="${user.id}"><i class="bi bi-trash me-2"></i> Delete Permanently</button></li>
                        </ul>
                    </div>
                    `}
                </td>
            </tr>
        `;
    }).join('');

    renderPagination(
        'admin-users-pagination', 
        currentUsersPage, 
        Math.ceil(count / USERS_PER_PAGE), 
        (newPage) => loadUsers(newPage)
    );
}

async function loadListings(page = 1) {
    currentListingsPage = page;
    const tbody = document.getElementById('admin-listings-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';

    const { data, count, error } = await getListings({ page, limit: LISTINGS_PER_PAGE });
    if (error || !data) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-danger text-center">Failed to load listings</td></tr>';
        return;
    }

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No listings found</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(l => `
        <tr>
            <td><a href="#/details/${l.id}" class="fw-bold text-decoration-none">${l.title}</a></td>
            <td>${l.brand} ${l.model}</td>
            <td>&euro;${l.price.toLocaleString()}</td>
            <td class="text-end">
                <div class="dropdown">
                    <button class="btn btn-sm btn-action-premium dropdown-toggle" type="button" aria-expanded="false">
                        Actions
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" style="border-radius: 0.75rem; overflow: hidden;">
                        <li><a class="dropdown-item" href="#/details/${l.id}"><i class="bi bi-eye me-2 text-primary"></i> View</a></li>
                        <li><a class="dropdown-item" href="#/edit/${l.id}"><i class="bi bi-pencil me-2 text-success"></i> Edit</a></li>
                        <li><button class="dropdown-item" data-action="manage-images" data-id="${l.id}"><i class="bi bi-images me-2 text-info"></i> Manage Images</button></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item text-danger fw-medium" data-action="delete" data-id="${l.id}"><i class="bi bi-trash me-2"></i> Delete</button></li>
                    </ul>
                </div>
            </td>
        </tr>
    `).join('');

    renderPagination(
        'admin-listings-pagination', 
        currentListingsPage, 
        Math.ceil(count / LISTINGS_PER_PAGE), 
        (newPage) => loadListings(newPage)
    );
}

function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<ul class="pagination pagination-sm mb-0">';
    
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage - 1}">&laquo;</button>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        // Show limited pages (first, last, current, +/- 1)
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" data-page="${i}">${i}</button>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage + 1}">&raquo;</button>
        </li>
    </ul>`;

    container.innerHTML = html;

    const buttons = container.querySelectorAll('button.page-link');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newPage = parseInt(e.target.getAttribute('data-page'), 10);
            if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                onPageChange(newPage);
            }
        });
    });
}

async function openManageImagesModal(listingId) {
    const container = document.getElementById('admin-images-modal-container');
    container.innerHTML = `
        <div class="modal fade" id="adminImagesModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Manage Images</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4 p-3 bg-light rounded border">
                            <label class="form-label fw-bold">Upload New Images</label>
                            <div class="d-flex gap-2">
                                <input type="file" class="form-control" id="admin-image-upload" multiple accept="image/jpeg, image/png, image/webp">
                                <button class="btn btn-primary" id="admin-upload-btn" type="button">Upload</button>
                            </div>
                        </div>
                        <h6 class="fw-bold mb-3">Existing Images</h6>
                        <div id="admin-images-loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
                        <div id="admin-images-grid" class="row g-3"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    import('bootstrap').then(({ Modal }) => {
        const modalEl = document.getElementById('adminImagesModal');
        const modal = new Modal(modalEl);
        modal.show();

        loadImagesForModal(listingId);

        const uploadBtn = document.getElementById('admin-upload-btn');
        const uploadInput = document.getElementById('admin-image-upload');

        uploadBtn.addEventListener('click', async () => {
            const files = uploadInput.files;
            if (files.length === 0) {
                showToast('Please select images to upload', 'warning');
                return;
            }

            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

            const { successful, failed } = await uploadMultipleImages(listingId, files);

            if (failed.length > 0) {
                showToast(`Failed to upload ${failed.length} images`, 'danger');
            }
            if (successful.length > 0) {
                showToast(`Successfully uploaded ${successful.length} images`, 'success');
                uploadInput.value = '';
                loadImagesForModal(listingId);
            }

            uploadBtn.disabled = false;
            uploadBtn.innerHTML = 'Upload';
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
            container.innerHTML = ''; // cleanup
        });
    });
}

async function loadImagesForModal(listingId) {
    const loading = document.getElementById('admin-images-loading');
    const grid = document.getElementById('admin-images-grid');
    if (!loading || !grid) return;

    try {
        const { urls, files, error } = await getListingImageUrls(listingId);
        loading.style.display = 'none';

        if (error) throw error;

        if (!urls || urls.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center text-muted py-4">No images found.</div>';
            return;
        }

        grid.innerHTML = urls.map((url, i) => `
            <div class="col-md-4">
                <div class="position-relative" id="admin-img-col-${i}">
                    <img src="${url}" class="img-fluid rounded shadow-sm" style="height: 150px; width: 100%; object-fit: cover;">
                    <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" onclick="handleAdminDeleteImage('${files[i].name}', '${listingId}', 'admin-img-col-${i}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
        loading.style.display = 'none';
        grid.innerHTML = '<div class="col-12 text-center text-danger">Failed to load images.</div>';
    }
}

window.handleAdminDeleteImage = async function(fileName, listingId, colId) {
    if (await showConfirmModal('Delete Image', 'Permanently delete this inappropriate image?')) {
        const filePath = `${listingId}/${fileName}`;
        const { error } = await deleteImage(filePath);
        if (error) {
            showToast('Failed to delete image', 'danger');
        } else {
            showToast('Image deleted', 'success');
            document.getElementById(colId)?.remove();
        }
    }
};

async function openEditUserModal(userId, currentUsername, currentFullname) {
    const container = document.getElementById('admin-edit-user-modal-container');
    container.innerHTML = `
        <div class="modal fade" id="adminEditUserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit User Profile</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="admin-edit-user-form">
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" class="form-control" id="edit-user-username" value="${currentUsername}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="edit-user-fullname" value="${currentFullname}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="admin-edit-user-save">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    import('bootstrap').then(({ Modal }) => {
        const modalEl = document.getElementById('adminEditUserModal');
        const modal = new Modal(modalEl);
        modal.show();

        document.getElementById('admin-edit-user-save').addEventListener('click', async (e) => {
            const btn = e.target;
            btn.disabled = true;
            btn.innerHTML = 'Saving...';

            const newUsername = document.getElementById('edit-user-username').value.trim();
            const newFullname = document.getElementById('edit-user-fullname').value.trim();

            const { error } = await updateUserProfile(userId, {
                username: newUsername,
                full_name: newFullname
            });

            if (error) {
                showToast('Failed to update user profile', 'danger');
                btn.disabled = false;
                btn.innerHTML = 'Save Changes';
            } else {
                showToast('User profile updated successfully', 'success');
                modal.hide();
                loadUsers(currentUsersPage);
            }
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
            container.innerHTML = ''; // cleanup
        });
    });
}
