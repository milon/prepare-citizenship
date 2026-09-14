export type ThemePreference = 'system' | 'light' | 'dark';
export type FontSizePreference = 'md' | 'lg' | 'xl';

export function parseTheme(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

export function parseFontSize(value: unknown): FontSizePreference {
  return value === 'lg' || value === 'xl' || value === 'md' ? value : 'md';
}

export function resolvedTheme(theme: ThemePreference): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyAppearance(theme: ThemePreference, fontSize: FontSizePreference) {
  const resolved = resolvedTheme(theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.resolved = resolved;
  document.documentElement.dataset.font = fontSize;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', resolved === 'dark' ? '#1a1214' : '#c8102e');
}
