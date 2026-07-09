/**
 * Profile page.
 * Premium profile with avatar, stats, edit form, and avatar management.
 * Fetches real data from Supabase.
 */
import { getUser, forceProfileRefresh } from '../../utils/authState.js';
import { getProfile, updateProfile, uploadAvatar, removeAvatar, getUserStats } from '../../services/profileService.js';

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
        getUserStats(user.id),
    ]);

    const profile = profileResult.data;
    const stats = statsResult;
    const container = document.getElementById('profile-page');

    if (!profile || profileResult.error) {
        container.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Failed to load profile. Please try again later.
                </div>
            </div>`;
        return;
    }

    container.innerHTML = buildProfileView(user, profile, stats);
    attachViewListeners(user, profile, stats);
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
        ? `<img src="${profile.avatar_url}" alt="Avatar" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(37,99,235,0.3);" />`
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

                        <div id="profile-alert"></div>

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

    const alertBox = document.getElementById('profile-alert');
    const saveBtn = document.getElementById('save-profile-btn');
    const avatarInput = document.getElementById('avatar-file-input');

    alertBox.innerHTML = '';

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
                showProfileAlert(alertBox, 'danger', `Avatar upload failed: ${avatarError.message}`);
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
            showProfileAlert(alertBox, 'danger', error.message || 'Failed to update profile.');
            resetSaveButton(saveBtn);
            return;
        }

        // Refresh auth state cache (this triggers navbar re-render)
        await forceProfileRefresh();

        // Re-fetch and re-render the whole page
        const { data: updatedProfile } = await getProfile(user.id);
        const container = document.getElementById('profile-page');
        container.innerHTML = buildProfileView(user, updatedProfile || profile, stats);
        attachViewListeners(user, updatedProfile || profile, stats);

        // Show success alert in the new view
        const newAlertBox = document.getElementById('profile-alert');
        if (newAlertBox) {
            toggleEditSection(true);
            showProfileAlert(newAlertBox, 'success', 'Profile updated successfully!');
        }
    } catch (err) {
        showProfileAlert(alertBox, 'danger', 'An unexpected error occurred.');
        resetSaveButton(saveBtn);
    }
}

/**
 * Handle remove avatar.
 */
async function handleRemoveAvatar(user, profile, stats) {
    const removeBtn = document.getElementById('remove-avatar-btn');
    if (removeBtn) {
        removeBtn.disabled = true;
        removeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Removing...';
    }

    try {
        const { error } = await removeAvatar(user.id);

        if (error) {
            const alertBox = document.getElementById('profile-alert');
            showProfileAlert(alertBox, 'danger', `Failed to remove avatar: ${error.message}`);
            if (removeBtn) {
                removeBtn.disabled = false;
                removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Remove';
            }
            return;
        }

        // Refresh auth state cache (this triggers navbar re-render)
        await forceProfileRefresh();

        // Re-fetch and re-render
        const { data: updatedProfile } = await getProfile(user.id);
        const container = document.getElementById('profile-page');
        container.innerHTML = buildProfileView(user, updatedProfile || profile, stats);
        attachViewListeners(user, updatedProfile || profile, stats);

        toggleEditSection(true);
        const newAlertBox = document.getElementById('profile-alert');
        if (newAlertBox) {
            showProfileAlert(newAlertBox, 'success', 'Avatar removed successfully!');
        }
    } catch (err) {
        if (removeBtn) {
            removeBtn.disabled = false;
            removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Remove';
        }
    }
}

/**
 * Show an alert in the profile edit section.
 */
function showProfileAlert(container, type, message) {
    if (!container) return;
    const icon = type === 'success' ? 'bi-check-circle-fill'
        : type === 'danger' ? 'bi-exclamation-triangle-fill'
        : 'bi-info-circle-fill';

    container.innerHTML = `
        <div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show" role="alert">
            <i class="bi ${icon} me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
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
