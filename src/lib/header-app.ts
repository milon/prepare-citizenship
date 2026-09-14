import { applyAppearance, type ThemePreference } from './appearance';
import { loadProgress, saveProgress } from './progress';

const THEME_ORDER: ThemePreference[] = ['system', 'light', 'dark'];

const THEME_LABELS: Record<ThemePreference, string> = {
  system: 'Auto',
  light: 'Light',
  dark: 'Dark',
};

export function siteHeaderApp() {
  return {
    menuOpen: false,
    theme: 'system' as ThemePreference,

    init() {
      this.theme = loadProgress().progress.settings.theme;
    },

    get themeLabel(): string {
      return THEME_LABELS[this.theme];
    },

    get nextThemeLabel(): string {
      const next = THEME_ORDER[(THEME_ORDER.indexOf(this.theme) + 1) % THEME_ORDER.length];
      return THEME_LABELS[next];
    },

    cycleTheme() {
      this.theme = THEME_ORDER[(THEME_ORDER.indexOf(this.theme) + 1) % THEME_ORDER.length];
      const loaded = loadProgress();
      loaded.progress.settings.theme = this.theme;
      applyAppearance(this.theme, loaded.progress.settings.fontSize);
      saveProgress(loaded.progress);
    },
  };
}
