/**
 * Pagination component.
 * Styled pagination with custom design-system tokens.
 */

/**
 * Render pagination controls.
 * @param {Object} options
 * @param {number} options.currentPage
 * @param {number} options.totalPages
 * @returns {string} The pagination markup.
 */
export function renderPagination({ currentPage = 1, totalPages = 1 } = {}) {
    if (totalPages <= 1) return '';

    let items = '';

    items += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                <i class="bi bi-chevron-left" style="font-size: 0.8rem;"></i>
            </a>
        </li>`;

    for (let i = 1; i <= totalPages; i++) {
        items += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }

    items += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                <i class="bi bi-chevron-right" style="font-size: 0.8rem;"></i>
            </a>
        </li>`;

    return `
    <nav aria-label="Listings pagination">
        <ul class="pagination justify-content-center mb-0">
            ${items}
        </ul>
    </nav>`;
}
