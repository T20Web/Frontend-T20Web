const STORAGE_KEY = 't20_theme';

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch (e) { /* ignore */ }
  return null;
}

export function systemPrefersDark() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
}

export function getInitialTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;
  return systemPrefersDark() ? 'dark' : 'light';
}

export function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) { /* ignore */ }
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
  return next;
}
