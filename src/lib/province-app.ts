import { applyAppearance, type FontSizePreference, type ThemePreference } from './appearance';
import { REGION_CODES, type RegionCode } from '../content/schema';
import { localizedRegionLabel, t, type Locale } from './i18n';
import { todayStamp } from './dates';
import { DISPLAY_NAME_MAX, nameFileSlug, parseDisplayName } from './display-name';
import {
  loadProgress,
  parseImportedProgress,
  resetProgress,
  saveProgress,
} from './progress';

export function regionOptionsFor(locale: Locale = 'en') {
  return REGION_CODES.map((code) => ({
    code,
    label: localizedRegionLabel(code, locale),
  }));
}

export const regionOptions = regionOptionsFor('en');

export function provincePickerApp() {
  return {
    options: regionOptions,
    selected: '' as RegionCode | '',
    saveFailed: false,
    storageAvailable: true,
    redirect: '/',

    init() {
      const loaded = loadProgress();
      this.storageAvailable = loaded.storageAvailable;
      this.selected = loaded.progress.province ?? '';
      this.options = regionOptionsFor(loaded.progress.settings.locale);
      const root = document.querySelector('[data-province-redirect]') as HTMLElement | null;
      this.redirect = root?.dataset.provinceRedirect ?? '/';
    },

    save() {
      if (!this.selected) {
        return;
      }
      const loaded = loadProgress();
      loaded.progress.province = this.selected;
      this.saveFailed = !saveProgress(loaded.progress);
      if (!this.saveFailed) {
        const target = new URL(this.redirect, window.location.origin);
        if (target.pathname === window.location.pathname) {
          window.location.reload();
        } else {
          window.location.assign(`${target.pathname}${target.search}`);
        }
      }
    },
  };
}

type LearnerStore = {
  name: string;
};

export function settingsApp() {
  return {
    options: regionOptions,
    selected: '' as RegionCode | '',
    saved: false,
    saveFailed: false,
    message: '',
    error: '',
    theme: 'system' as ThemePreference,
    fontSize: 'md' as FontSizePreference,
    displayName: '',
    nameMax: DISPLAY_NAME_MAX,
    locale: 'en' as Locale,

    tx(key: string, vars?: Record<string, string | number>) {
      return t(key, this.locale, vars);
    },

    init() {
      const loaded = loadProgress();
      this.selected = loaded.progress.province ?? '';
      this.saveFailed = !loaded.storageAvailable;
      this.theme = loaded.progress.settings.theme;
      this.fontSize = loaded.progress.settings.fontSize;
      this.displayName = loaded.progress.settings.displayName;
      this.locale = loaded.progress.settings.locale;
      this.options = regionOptionsFor(this.locale);
    },

    learnerStore(): LearnerStore {
      return (this as unknown as { $store: { learner: LearnerStore } }).$store.learner;
    },

    persistSettings() {
      const loaded = loadProgress();
      this.displayName = parseDisplayName(this.displayName);
      loaded.progress.settings.theme = this.theme;
      loaded.progress.settings.fontSize = this.fontSize;
      loaded.progress.settings.displayName = this.displayName;
      loaded.progress.settings.locale = this.locale;
      this.learnerStore().name = this.displayName;
      applyAppearance(this.theme, this.fontSize);
      this.saveFailed = !saveProgress(loaded.progress);
      const i18n = (this as unknown as { $store: { i18n: { locale: Locale } } }).$store.i18n;
      if (i18n.locale !== this.locale) {
        i18n.locale = this.locale;
        window.location.reload();
      }
    },

    save() {
      if (!this.selected) {
        return;
      }
      const loaded = loadProgress();
      loaded.progress.province = this.selected;
      this.displayName = parseDisplayName(this.displayName);
      loaded.progress.settings.displayName = this.displayName;
      loaded.progress.settings.locale = this.locale;
      this.learnerStore().name = this.displayName;
      this.saveFailed = !saveProgress(loaded.progress);
      this.saved = !this.saveFailed;
      this.message = this.saved ? this.tx('settings.saved') : '';
      this.error = '';
    },

    exportProgress() {
      const loaded = loadProgress();
      const slug = nameFileSlug(loaded.progress.settings.displayName);
      const blob = new Blob([JSON.stringify(loaded.progress, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prepare-citizenship-progress${slug ? `-${slug}` : ''}-${todayStamp()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this.message = this.tx('settings.exported');
      this.error = '';
    },

    async importProgress(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      input.value = '';
      if (!file) {
        return;
      }
      if (
        !window.confirm(this.tx('settings.importConfirm'))
      ) {
        return;
      }
      try {
        const parsed = parseImportedProgress(JSON.parse(await file.text()));
        if (!parsed.ok) {
          this.error = this.tx(
            parsed.code === 'version' ? 'settings.importVersion' : 'settings.importInvalid',
          );
          this.message = '';
          return;
        }
        this.saveFailed = !saveProgress(parsed.progress);
        if (this.saveFailed) {
          this.error = this.tx('settings.importFail');
          this.message = '';
          return;
        }
        this.selected = parsed.progress.province ?? '';
        this.theme = parsed.progress.settings.theme;
        this.fontSize = parsed.progress.settings.fontSize;
        this.displayName = parsed.progress.settings.displayName;
        this.locale = parsed.progress.settings.locale;
        this.options = regionOptionsFor(this.locale);
        this.learnerStore().name = this.displayName;
        applyAppearance(this.theme, this.fontSize);
        const i18n = (this as unknown as { $store: { i18n: { locale: Locale } } }).$store.i18n;
        if (i18n.locale !== this.locale) {
          i18n.locale = this.locale;
          window.location.reload();
          return;
        }
        this.message = this.tx('settings.imported');
        this.error = '';
        this.saved = false;
      } catch {
        this.error = this.tx('settings.importJson');
        this.message = '';
      }
    },

    reset() {
      if (
        !window.confirm(this.tx('settings.resetConfirm'))
      ) {
        return;
      }
      const next = resetProgress(true);
      this.selected = next.province ?? '';
      this.theme = next.settings.theme;
      this.fontSize = next.settings.fontSize;
      this.displayName = next.settings.displayName;
      this.locale = next.settings.locale;
      this.learnerStore().name = this.displayName;
      applyAppearance(this.theme, this.fontSize);
      this.message = this.tx('settings.resetOk');
      this.error = '';
      this.saved = false;
    },
  };
}
