/**
 * Admin Sidebar component.
 * Sleek vertical sidebar with icons, active states, and a logout section.
 */

/**
 * Render the admin sidebar HTML.
 * @returns {string} The sidebar markup.
 */
export function renderSidebar() {
    const items = [
        { href: '#/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
        { href: '#/admin/users', icon: 'bi-people', label: 'Users' },
        { href: '#/admin/listings', icon: 'bi-card-list', label: 'Listings' },
        { href: '#/admin/reports', icon: 'bi-flag', label: 'Reports' },
        { href: '#/admin/settings', icon: 'bi-gear', label: 'Settings' },
    ];

    const currentHash = window.location.hash || '#/';

    return `
    <div class="d-flex flex-column flex-shrink-0" style="
        width: 260px;
        min-height: 100%;
        background: var(--am-gradient-dark);
        padding: 1.5rem;
        border-right: 1px solid rgba(255,255,255,0.06);
    ">
        <div class="d-flex align-items-center gap-2 mb-4 px-1">
            <span style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: rgba(37, 99, 235, 0.2);
                color: var(--am-primary-light);
            ">
                <i class="bi bi-shield-lock-fill"></i>
            </span>
            <span style="font-family: var(--am-font-display); font-weight: 700; font-size: 1.05rem; color: #fff;">
                Admin Panel
            </span>
        </div>

        <ul class="nav flex-column gap-1 mb-auto">
            ${items.map(item => {
                const isActive = currentHash === item.href;
                return `
                <li class="nav-item">
                    <a href="${item.href}" style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.65rem 1rem;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 500;
                        font-size: 0.9rem;
                        transition: all 0.2s ease;
                        color: ${isActive ? '#fff' : 'rgba(255,255,255,0.55)'};
                        background: ${isActive ? 'var(--am-gradient-primary)' : 'transparent'};
                        ${isActive ? 'box-shadow: 0 4px 12px rgba(37,99,235,0.3);' : ''}
                    ">
                        <i class="bi ${item.icon}" style="font-size: 1.05rem;"></i>
                        ${item.label}
                        ${item.label === 'Reports'
                            ? '<span style="margin-left: auto; font-size: 0.7rem; background: var(--am-danger); color: #fff; padding: 2px 7px; border-radius: 99px; font-weight: 600;">3</span>'
                            : ''}
                    </a>
                </li>`;
            }).join('')}
        </ul>

        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem; margin-top: 1rem;">
            <a href="#/" style="
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.65rem 1rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 500;
                font-size: 0.9rem;
                color: rgba(255,255,255,0.4);
                transition: all 0.2s ease;
            " onmouseover="this.style.color='var(--am-danger)'; this.style.background='rgba(239,68,68,0.1)'"
               onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.background='transparent'">
                <i class="bi bi-box-arrow-left"></i>
                Back to Site
            </a>
        </div>
    </div>`;
}
