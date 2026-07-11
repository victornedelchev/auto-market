/**
 * Theme Service.
 * Manages the light/dark/auto theme state.
 */

const THEME_KEY = 'am_theme';
let mediaQueryListener = null;

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'auto';
}

export function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent('am-theme-changed'));
}

function applyTheme(theme) {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

export function initTheme() {
    const savedTheme = getTheme();
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQueryListener) {
        mediaQuery.removeEventListener('change', mediaQueryListener);
    }
    mediaQueryListener = (e) => {
        if (getTheme() === 'auto') {
            applyTheme('auto');
            window.dispatchEvent(new CustomEvent('am-theme-changed'));
        }
    };
    mediaQuery.addEventListener('change', mediaQueryListener);
}
