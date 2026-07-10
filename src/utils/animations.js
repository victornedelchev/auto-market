/**
 * Initializes scroll animations for elements with the .animate-on-scroll class.
 * When the element enters the viewport, the .is-visible class is added.
 */
export function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll:not(.is-visible)');

    if (!elements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 15% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing once the animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
}
