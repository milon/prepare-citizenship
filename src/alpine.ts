import type { Alpine } from 'alpinejs';
import { applyAppearance } from './lib/appearance';
import { parseDisplayName, possessiveName } from './lib/display-name';
import { dashboardApp } from './lib/dashboard-app';
import { siteHeaderApp } from './lib/header-app';
import { flashcardsApp, type FlashcardsPayload } from './lib/flashcards-app';
import { mockApp, type MockPayload } from './lib/mock-app';
import { watchForInstallAndPersist } from './lib/persist-storage';
import { practiceApp, type PracticePayload } from './lib/practice-app';
import { provincePickerApp, settingsApp } from './lib/province-app';
import { loadProgress, subscribeStorage } from './lib/progress';
import {
  applyDocumentLocale,
  localizedChapterTitle,
  localizedRegionLabel,
  pickLocalized,
  speakText,
  t,
  type Locale,
  type LocalizedText,
} from './lib/i18n';

function readJson<T>(id: string): T | null {
  const element = document.getElementById(id);
  if (!element?.textContent) {
    return null;
  }
  return JSON.parse(element.textContent) as T;
}

type StorageStore = {
  available: boolean;
  saveFailed: boolean;
};

type LearnerStore = {
  name: string;
  possessive(): string;
};

type I18nStore = {
  locale: Locale;
  t(key: string, vars?: Record<string, string | number>): string;
  pick(text: LocalizedText | string): string;
  chapter(id: string): string;
  region(code: string): string;
};

export default (Alpine: Alpine) => {
  Alpine.store('storage', {
    available: true,
    saveFailed: false,
  } satisfies StorageStore);

  Alpine.store('learner', {
    name: '',
    possessive() {
      return possessiveName(this.name);
    },
  } satisfies LearnerStore);

  Alpine.store('i18n', {
    locale: 'en',
    t(key, vars) {
      return t(key, this.locale, vars);
    },
    pick(text) {
      return pickLocalized(text, this.locale);
    },
    chapter(id) {
      return localizedChapterTitle(id as Parameters<typeof localizedChapterTitle>[0], this.locale);
    },
    region(code) {
      return localizedRegionLabel(code as Parameters<typeof localizedRegionLabel>[0], this.locale);
    },
  } satisfies I18nStore);

  subscribeStorage((notice) => {
    const store = Alpine.store('storage') as StorageStore;
    store.available = notice.available;
    store.saveFailed = notice.saveFailed;
  });

  const loaded = loadProgress();
  const store = Alpine.store('storage') as StorageStore;
  store.available = loaded.storageAvailable;
  store.saveFailed = loaded.saveFailed;
  (Alpine.store('learner') as LearnerStore).name = parseDisplayName(
    loaded.progress.settings.displayName,
  );
  const i18n = Alpine.store('i18n') as I18nStore;
  i18n.locale = loaded.progress.settings.locale;
  applyDocumentLocale(i18n.locale);

  applyAppearance(loaded.progress.settings.theme, loaded.progress.settings.fontSize);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = loadProgress().progress.settings;
    applyAppearance(current.theme, current.fontSize);
  });

  watchForInstallAndPersist();

  Alpine.data('siteHeader', () => siteHeaderApp());

  Alpine.data('dashboardPage', () => dashboardApp());

  Alpine.data('provinceGate', () => ({
    needsPicker: true,
    redirect: '/',
    init() {
      const loaded = loadProgress();
      this.needsPicker = !loaded.progress.province;
      const root = (this as { $el: HTMLElement }).$el;
      this.redirect = root.dataset.redirect ?? '/';
    },
  }));

  Alpine.data('provincePicker', () => provincePickerApp());

  Alpine.data('settingsPage', () => settingsApp());

  Alpine.data('speech', () => ({
    speak(text: string) {
      const locale = (Alpine.store('i18n') as I18nStore).locale;
      speakText(text, locale);
    },
  }));

  const flashcards = readJson<FlashcardsPayload>('flashcards-data');
  if (flashcards) {
    Alpine.data('flashcardsPage', () => flashcardsApp(flashcards));
  }

  const practice = readJson<PracticePayload>('practice-data');
  if (practice) {
    Alpine.data('practicePage', () => practiceApp(practice));
  }

  const mock = readJson<MockPayload>('mock-data');
  if (mock) {
    Alpine.data('mockPage', () => mockApp(mock));
  }
};
