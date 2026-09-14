import { REGION_CODES, type RegionCode } from '../content/schema';
import { REGION_LABELS } from './chapters';
import { todayStamp } from './dates';
import {
  loadProgress,
  parseImportedProgress,
  resetProgress,
  saveProgress,
} from './progress';

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
    message: '',
    error: '',

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
      this.message = this.saved ? 'Province saved.' : '';
      this.error = '';
    },

    exportProgress() {
      const loaded = loadProgress();
      const blob = new Blob([JSON.stringify(loaded.progress, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prepare-citizenship-progress-${todayStamp()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this.message = 'Progress file downloaded.';
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
        !window.confirm(
          'Importing will replace the progress saved on this device. Continue?',
        )
      ) {
        return;
      }
      try {
        const parsed = parseImportedProgress(JSON.parse(await file.text()));
        if (!parsed.ok) {
          this.error = parsed.message;
          this.message = '';
          return;
        }
        this.saveFailed = !saveProgress(parsed.progress);
        if (this.saveFailed) {
          this.error = 'Could not save imported progress in this browser.';
          this.message = '';
          return;
        }
        this.selected = parsed.progress.province ?? '';
        this.message = 'Progress imported.';
        this.error = '';
        this.saved = false;
      } catch {
        this.error = 'That file could not be read as JSON.';
        this.message = '';
      }
    },

    reset() {
      if (
        !window.confirm(
          'Reset quiz history, flashcards, and missed questions? Your province will be kept.',
        )
      ) {
        return;
      }
      const next = resetProgress(true);
      this.selected = next.province ?? '';
      this.message = 'Progress reset.';
      this.error = '';
      this.saved = false;
    },
  };
}
