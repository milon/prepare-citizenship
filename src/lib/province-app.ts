import { REGION_CODES, type RegionCode } from '../content/schema';
import { REGION_LABELS } from './chapters';
import { loadProgress, saveProgress } from './progress';

export const regionOptions = REGION_CODES.map((code) => ({
  code,
  label: REGION_LABELS[code],
}));

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

export function settingsApp() {
  return {
    options: regionOptions,
    selected: '' as RegionCode | '',
    saved: false,
    saveFailed: false,

    init() {
      const loaded = loadProgress();
      this.selected = loaded.progress.province ?? '';
      this.saveFailed = !loaded.storageAvailable;
    },

    save() {
      if (!this.selected) {
        return;
      }
      const loaded = loadProgress();
      loaded.progress.province = this.selected;
      this.saveFailed = !saveProgress(loaded.progress);
      this.saved = !this.saveFailed;
    },
  };
}
