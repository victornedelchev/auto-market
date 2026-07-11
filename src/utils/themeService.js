/**
 * Theme Service.
 * Manages the light/dark theme state.
 */

const THEME_KEY = 'am_theme';

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(THEME_KEY, 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'light');
    }
}

export function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    return newTheme;
}

export function initTheme() {
    const savedTheme = getTheme();
    setTheme(savedTheme);
}
