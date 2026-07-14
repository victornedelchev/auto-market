/**
 * Profile page.
 * Premium profile with avatar, stats, edit form, and avatar management.
 * Fetches real data from Supabase.
 */
import { getUser, forceProfileRefresh } from '../../utils/authState.js';
import { getProfile, updateProfile, uploadAvatar, removeAvatar, getUserStats } from '../../services/profileService.js';
import { getListingsByUser } from '../../services/listingService.js';
import { getListingImageUrls } from '../../services/storageService.js';
import { renderListingCard } from '../../components/listingCard/listingCard.js';
import { showToast } from '../../utils/toastService.js';
import { showConfirmModal } from '../../utils/modalService.js';
import { initScrollAnimations } from '../../utils/animations.js';

let currentListingsPage = 1;
const LISTINGS_PER_PAGE = 9;

/**
 * Render the profile page (loading state initially).
 * @returns {string} The page markup.
 */
export function renderProfilePage() {
    return `
    <div id="profile-page">
        <div class="d-flex justify-content-center align-items-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading profile...</span>
            </div>
        </div>
    </div>`;
}

/**
 * Initialize the profile page — fetch data and render real content.
 * Called after the HTML shell is in the DOM.
 */
export async function initProfilePage() {
    const user = getUser();
    if (!user) return;

    const [profileResult, statsResult] = await Promise.all([
        getProfile(user.id),
        getUserStats(user.id)
    ]);

    const profile = profileResult.data;
    const stats = statsResult;
    const container = document.getElementById('profile-page');

    if (!profile || profileResult.error) {
        console.error('Failed to load profile:', profileResult.error);
        showToast('Failed to load profile.', 'danger');
        container.innerHTML = `
            <div class="text-center mt-5 text-muted">Failed to load profile data.</div>
        `;
        return;
    }

    container.innerHTML = buildProfileView(user, profile, stats);
    attachViewListeners(user, profile, stats);
    initScrollAnimations();
    loadUserListings(1);
}

/**
 * Build the full profile view HTML.
 */
function buildProfileView(user, profile, stats) {
    const initials = getInitials(profile.full_name || user.email);
    const displayName = profile.full_name || user.email.split('@')[0];
    const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });

    const avatarHtml = profile.avatar_url
        ? `<div style="position: relative; display: inline-block;">
             <img src="${profile.avatar_url}" alt="Avatar" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(37,99,235,0.3);" />
             <button id="download-avatar-btn" data-url="${profile.avatar_url}"
                style="position: absolute; bottom: -5px; right: -5px; width: 30px; height: 30px; 
                       background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: #fff; 
                       border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                       border: 2px solid rgba(255,255,255,0.5); transition: background 0.2s; cursor: pointer;"
                onmouseover="this.style.background='var(--am-primary)'"
                onmouseout="this.style.background='rgba(0,0,0,0.65)'"
                title="Download Avatar">
                 <i class="bi bi-download" style="font-size: 0.85rem;"></i>
             </button>
           </div>`
        : `<div style="width: 90px; height: 90px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--am-font-display); font-weight: 800; font-size: 2rem; border: 4px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(37,99,235,0.3);">${initials}</div>`;

    return `
    <!-- Profile Header -->
    <div style="background: var(--am-gradient-hero); padding: 3rem 0 5rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -60px; right: -40px; width: 250px; height: 250px; border-radius: 50%; background: rgba(37,99,235,0.08);"></div>
        <div class="container position-relative">
            <div class="d-flex align-items-center gap-4 flex-wrap">
                ${avatarHtml}
                <div>
                    <h1 style="font-family: var(--am-font-display); font-weight: 800; font-size: 1.8rem; color: #fff; margin: 0;">${displayName}</h1>
                    <p style="color: rgba(255,255,255,0.5); margin: 0.25rem 0 0.5rem;">
                        <i class="bi bi-envelope me-1"></i>${user.email}
                    </p>
                    <div class="d-flex gap-3 align-items-center flex-wrap">
                        ${profile.phone ? `<span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;"><i class="bi bi-telephone me-1"></i>${profile.phone}</span>` : ''}
                        ${profile.city ? `<span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;"><i class="bi bi-geo-alt me-1"></i>${profile.city}</span>` : ''}
                        <span style="color: rgba(255,255,255,0.4); font-size: 0.82rem;">
                            <i class="bi bi-clock me-1"></i>Member since ${memberSince}
                        </span>
                    </div>
                </div>
                <div class="ms-auto d-none d-md-block">
                    <button class="btn btn-am-ghost" id="edit-profile-btn">
                        <i class="bi bi-pencil me-1"></i>Edit Profile
                    </button>
                </div>
            </div>
            <!-- Mobile edit button -->
            <div class="d-md-none mt-3">
                <button class="btn btn-am-ghost w-100" id="edit-profile-btn-mobile">
                    <i class="bi bi-pencil me-1"></i>Edit Profile
                </button>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="container" style="margin-top: -2.5rem; position: relative; z-index: 2;">
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="stat-card card-am-static">
                    <div class="stat-icon" style="background: var(--am-primary-100); color: var(--am-primary);">
                        <i class="bi bi-card-list"></i>
                    </div>
                    <div class="stat-value" style="color: var(--am-primary);">${stats.listings}</div>
                    <div class="stat-label">Active Listings</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card card-am-static">
                    <div class="stat-icon" style="background: #fee2e2; color: var(--am-danger);">
                        <i class="bi bi-heart-fill"></i>
                    </div>
                    <div class="stat-value" style="color: var(--am-danger);">${stats.favorites}</div>
                    <div class="stat-label">Favorites</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card card-am-static">
                    <div class="stat-icon" style="background: #d1fae5; color: var(--am-success);">
                        <i class="bi bi-person-check"></i>
                    </div>
                    <div class="stat-value" style="color: var(--am-success);">
                        ${profile.username || '—'}
                    </div>
                    <div class="stat-label">Username</div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Section (hidden by default) -->
        <div id="edit-profile-section" style="display: none;">
            <div class="row justify-content-center mb-4">
                <div class="col-lg-8">
                    <div class="card-am-static" style="padding: 2rem;">
                        <div class="d-flex align-items-center gap-2 mb-4">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--am-primary-100); display: flex; align-items: center; justify-content: center; color: var(--am-primary);">
                                <i class="bi bi-person-gear" style="font-size: 1.1rem;"></i>
                            </div>
                            <div>
                                <h3 style="font-family: var(--am-font-display); font-weight: 700; font-size: 1.3rem; margin: 0;">Edit Profile</h3>
                                <p style="color: var(--am-gray); font-size: 0.85rem; margin: 0;">Update your personal information</p>
                            </div>
                        </div>

                        <form id="profile-edit-form" novalidate>
                            <!-- Avatar Section -->
                            <div class="mb-4 text-center">
                                <div id="avatar-preview" class="mb-3 d-flex justify-content-center">
                                    ${profile.avatar_url
                                        ? `<img src="${profile.avatar_url}" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--am-primary-200); box-shadow: var(--am-shadow-md);" />`
                                        : `<div style="width: 100px; height: 100px; border-radius: 50%; background: var(--am-gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--am-font-display); font-weight: 800; font-size: 2.5rem; border: 3px solid var(--am-primary-200); box-shadow: var(--am-shadow-md);">${initials}</div>`
                                    }
                                </div>
                                <div class="d-flex justify-content-center gap-2">
                                    <label for="avatar-file-input" class="btn btn-sm btn-outline-primary" style="cursor: pointer; border-radius: 8px;">
                                        <i class="bi bi-upload me-1"></i>Upload Avatar
                                    </label>
                                    <input type="file" id="avatar-file-input" accept="image/*" class="d-none" />
                                    ${profile.avatar_url ? `
                                    <button type="button" class="btn btn-sm btn-outline-danger" id="remove-avatar-btn" style="border-radius: 8px;">
                                        <i class="bi bi-trash me-1"></i>Remove
                                    </button>` : ''}
                                </div>
                                <div id="avatar-file-name" style="font-size: 0.8rem; color: var(--am-gray); margin-top: 0.5rem;"></div>
                            </div>

                            <hr style="border-color: var(--am-light); margin: 1.5rem 0;">

                            <!-- Form Fields -->
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="edit-full-name" class="form-label">Full Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text" style="background: var(--am-light); border-right: none; color: var(--am-gray);">
                                            <i class="bi bi-person"></i>
                                        </span>
                                        <input type="text" class="form-control" id="edit-full-name"
                                               value="${profile.full_name || ''}"
                                               placeholder="Your full name"
                                               style="border-left: none;" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="edit-phone" class="form-label">Phone Number</label>
                                    <div class="input-group">
                                        <span class="input-group-text" style="background: var(--am-light); border-right: none; color: var(--am-gray);">
                                            <i class="bi bi-telephone"></i>
                                        </span>
                                        <input type="tel" class="form-control" id="edit-phone"
                                               value="${profile.phone || ''}"
                                               placeholder="+1 234 567 890"
                                               style="border-left: none;" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="edit-city" class="form-label">City</label>
                                    <div class="input-group">
                                        <span class="input-group-text" style="background: var(--am-light); border-right: none; color: var(--am-gray);">
                                            <i class="bi bi-geo-alt"></i>
                                        </span>
                                        <input type="text" class="form-control" id="edit-city"
                                               value="${profile.city || ''}"
                                               placeholder="Your city"
                                               style="border-left: none;" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <div class="input-group">
                                        <span class="input-group-text" style="background: var(--am-light); border-right: none; color: var(--am-gray);">
                                            <i class="bi bi-envelope"></i>
                                        </span>
                                        <input type="email" class="form-control" value="${user.email}" disabled
                                               style="border-left: none; background: var(--am-light); color: var(--am-gray);" />
                                    </div>
                                    <small style="color: var(--am-gray-light); font-size: 0.78rem;">Email cannot be changed</small>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" class="btn btn-am-ghost" id="cancel-edit-btn">
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn-am-primary" id="save-profile-btn">
                                    <i class="bi bi-check-lg me-1"></i>Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Listings -->
        <div id="profile-listings-section">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="section-header mb-0">
                    <div class="section-icon"><i class="bi bi-grid-3x3-gap-fill"></i></div>
                    <div>
                        <h2 style="font-size: 1.4rem;">My Listings</h2>
                        <span class="section-subtitle">Cars you currently have for sale</span>
                    </div>
                </div>
                <a href="#/create" class="btn btn-am-primary btn-sm">
                    <i class="bi bi-plus-lg me-1"></i>New Listing
                </a>
            </div>
            <div id="profile-listings-content">
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div id="profile-listings-pagination" class="d-flex justify-content-center mt-5 mb-4"></div>
        </div>
    </div>`;
}

/**
 * Attach event listeners for the profile view mode.
 */
function attachViewListeners(user, profile, stats) {
    // Edit button (desktop)
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => toggleEditSection(true));
    }

    // Edit button (mobile)
    const editBtnMobile = document.getElementById('edit-profile-btn-mobile');
    if (editBtnMobile) {
        editBtnMobile.addEventListener('click', () => toggleEditSection(true));
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => toggleEditSection(false));
    }

    // Save form
    const form = document.getElementById('profile-edit-form');
    if (form) {
        form.addEventListener('submit', (e) => handleSaveProfile(e, user, profile, stats));
    }

    // Avatar file input
    const avatarInput = document.getElementById('avatar-file-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarFileSelected);
    }

    // Remove avatar button
    const removeAvatarBtn = document.getElementById('remove-avatar-btn');
    if (removeAvatarBtn) {
        removeAvatarBtn.addEventListener('click', () => handleRemoveAvatar(user, profile, stats));
    }

    // Download avatar button
    const downloadAvatarBtn = document.getElementById('download-avatar-btn');
    if (downloadAvatarBtn) {
        downloadAvatarBtn.addEventListener('click', async (e) => {
            const url = e.currentTarget.getAttribute('data-url');
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                if (window.showSaveFilePicker) {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: 'avatar.jpg',
                        types: [{ description: 'Image', accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] } }]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                } else {
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = 'avatar.jpg';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    window.open(url, '_blank');
                }
            }
        });
    }
}

/**
 * Toggle the edit section visibility.
 */
function toggleEditSection(show) {
    const section = document.getElementById('edit-profile-section');
    if (section) {
        section.style.display = show ? 'block' : 'none';
        if (show) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Handle avatar file selection — show file name preview.
 */
function handleAvatarFileSelected() {
    const input = document.getElementById('avatar-file-input');
    const fileNameEl = document.getElementById('avatar-file-name');

    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            fileNameEl.innerHTML = '<span class="text-danger">Please select an image file.</span>';
            input.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            fileNameEl.innerHTML = '<span class="text-danger">Image must be smaller than 5MB.</span>';
            input.value = '';
            return;
        }

        fileNameEl.textContent = `Selected: ${file.name}`;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('avatar-preview');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Avatar preview" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--am-primary-200); box-shadow: var(--am-shadow-md);" />`;
            }
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Handle save profile form submission.
 */
async function handleSaveProfile(e, user, profile, stats) {
    e.preventDefault();

    const saveBtn = document.getElementById('save-profile-btn');
    const avatarInput = document.getElementById('avatar-file-input');

    const fullName = document.getElementById('edit-full-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const city = document.getElementById('edit-city').value.trim();

    // Set loading
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...';

    try {
        // Upload avatar if a file was selected
        if (avatarInput.files && avatarInput.files[0]) {
            const { error: avatarError } = await uploadAvatar(user.id, avatarInput.files[0]);
            if (avatarError) {
                showToast(`Avatar upload failed: ${avatarError.message}`, 'danger');
                resetSaveButton(saveBtn);
                return;
            }
        }

        // Update profile fields
        const { error } = await updateProfile(user.id, {
            full_name: fullName || null,
            phone: phone || null,
            city: city || null,
        });

        if (error) {
            showToast(error.message || 'Failed to update profile.', 'danger');
            resetSaveButton(saveBtn);
            return;
        }

        // Refresh auth state cache (this triggers navbar re-render)
        await forceProfileRefresh();

        const profileResult = await getProfile(user.id);
        const updatedProfile = profileResult.data;

        const container = document.getElementById('profile-page');
        container.innerHTML = buildProfileView(user, updatedProfile || profile, stats);
        attachViewListeners(user, updatedProfile || profile, stats);
        initScrollAnimations();
        loadUserListings(currentListingsPage);

        toggleEditSection(false);
        showToast('Profile updated successfully!', 'success');
    } catch (err) {
        showToast('An unexpected error occurred.', 'danger');
        resetSaveButton(saveBtn);
    }
}

/**
 * Handle remove avatar.
 */
async function handleRemoveAvatar(user, profile, stats) {
    const isConfirmed = await showConfirmModal(
        'Remove Profile Picture',
        'Are you sure you want to delete your profile picture?',
        'Delete',
        'danger'
    );

    if (!isConfirmed) return;

    const removeBtn = document.getElementById('remove-avatar-btn');
    if (removeBtn) {
        removeBtn.disabled = true;
        removeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Removing...';
    }

    try {
        const { error } = await removeAvatar(user.id);

        if (error) {
            showToast(`Failed to remove avatar: ${error.message}`, 'danger');
            if (removeBtn) {
                removeBtn.disabled = false;
                removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Remove';
            }
            return;
        }

        // Refresh auth state cache (this triggers navbar re-render)
        await forceProfileRefresh();

        const profileResult = await getProfile(user.id);
        const updatedProfile = profileResult.data;

        const container = document.getElementById('profile-page');
        container.innerHTML = buildProfileView(user, updatedProfile || profile, stats);
        attachViewListeners(user, updatedProfile || profile, stats);
        initScrollAnimations();
        loadUserListings(currentListingsPage);

        toggleEditSection(true);
        showToast('Avatar removed successfully!', 'success');
    } catch (err) {
        if (removeBtn) {
            removeBtn.disabled = false;
            removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Remove';
        }
    }
}


/**
 * Reset the save button to its default state.
 */
function resetSaveButton(btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Save Changes';
}

/**
 * Get initials from a name or email.
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
    const parts = name.split(/[\s@]+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || '?').toUpperCase();
}

async function loadUserListings(page = 1) {
    const user = getUser();
    if (!user) return;

    currentListingsPage = page;
    const container = document.getElementById('profile-listings-content');
    if (!container) return;

    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';

    const { data: listings, count, error } = await getListingsByUser(user.id, { page, limit: LISTINGS_PER_PAGE });

    if (error || !listings) {
        container.innerHTML = '<div class="alert alert-danger">Failed to load listings.</div>';
        return;
    }

    if (listings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 mb-4" style="background: var(--am-light); border-radius: var(--am-radius); border: 2px dashed #e2e8f0;">
                <i class="bi bi-car-front text-muted" style="font-size: 3rem;"></i>
                <h4 class="mt-3" style="color: var(--am-dark-700);">No listings yet</h4>
                <p class="text-muted">You haven't posted any cars for sale.</p>
                <a href="#/create" class="btn btn-am-primary mt-2">Create your first listing</a>
            </div>
        `;
        document.getElementById('profile-listings-pagination').innerHTML = '';
        return;
    }

    const listingImages = {};
    await Promise.all(listings.map(async (l) => {
        const { urls } = await getListingImageUrls(l.id);
        if (urls && urls.length > 0) {
            listingImages[l.id] = urls[0];
        }
    }));

    container.innerHTML = `
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            ${listings.map(l => {
                const coverImage = listingImages[l.id] || 'https://dummyimage.com/400x250/1e293b/94a3b8&text=No+Image';
                const displayListing = {
                    ...l,
                    image: coverImage,
                    fuel: l.fuel_type || 'N/A'
                };
                return renderListingCard(displayListing, { showEdit: true });
            }).join('')}
        </div>
    `;

    initScrollAnimations();

    renderPagination(
        'profile-listings-pagination',
        currentListingsPage,
        Math.ceil(count / LISTINGS_PER_PAGE),
        (newPage) => loadUserListings(newPage)
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
