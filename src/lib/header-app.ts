import { applyAppearance, type ThemePreference } from './appearance';
import { t, type Locale } from './i18n';
import { loadProgress, saveProgress } from './progress';

const THEME_ORDER: ThemePreference[] = ['system', 'light', 'dark'];

export function siteHeaderApp() {
  return {
    theme: 'system' as ThemePreference,

    init() {
      this.theme = loadProgress().progress.settings.theme;
    },

    tx(key: string) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return t(key, locale);
    },

    get themeLabel(): string {
      return this.tx(`theme.${this.theme}`);
    },

    get nextThemeLabel(): string {
      const next = THEME_ORDER[(THEME_ORDER.indexOf(this.theme) + 1) % THEME_ORDER.length];
      return this.tx(`theme.${next}`);
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
