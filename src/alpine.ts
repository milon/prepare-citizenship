import type { Alpine } from 'alpinejs';
import { applyAppearance } from './lib/appearance';
import { contactFormApp } from './lib/contact-app';
import { parseDisplayName, possessiveName } from './lib/display-name';
import { dashboardApp } from './lib/dashboard-app';
import { siteHeaderApp } from './lib/header-app';
import { flashcardsApp, type FlashcardsPayload } from './lib/flashcards-app';
import { mockApp, type MockPayload } from './lib/mock-app';
import { installApp } from './lib/install-app';
import { watchForInstallAndPersist } from './lib/persist-storage';
import { practiceApp, type PracticePayload } from './lib/practice-app';
import { provincePickerApp, settingsApp } from './lib/province-app';
import { searchApp } from './lib/search-app';
import { sessionApp, type SessionPayload } from './lib/session-app';
import { dailyQuestionApp, type DailyPayload } from './lib/daily-app';
import { updateApp } from './lib/update-app';
import type { SearchDoc } from './lib/search';
import { loadProgress, subscribeStorage } from './lib/progress';
import {
  applyDocumentLocale,
  canUseSpeech,
  localizedChapterTitle,
  localizedRegionLabel,
  pickLocalized,
  subscribeSpeak,
  toggleSpeak,
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

type SpeechStore = {
  playing: boolean;
  loading: boolean;
  id: string | null;
  canSpeak(): boolean;
  isLoading(id: string): boolean;
  isPlaying(id: string): boolean;
  isActive(id: string): boolean;
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

  Alpine.store('speech', {
    playing: false,
    loading: false,
    id: null as string | null,
    canSpeak() {
      return canUseSpeech();
    },
    isLoading(id: string) {
      return this.loading && this.id === id;
    },
    isPlaying(id: string) {
      return this.playing && this.id === id;
    },
    isActive(id: string) {
      return this.id === id && (this.playing || this.loading);
    },
  } satisfies SpeechStore);
  subscribeSpeak((state) => {
    const store = Alpine.store('speech') as SpeechStore;
    store.playing = state.playing;
    store.loading = state.loading;
    store.id = state.id;
  });

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

  Alpine.data('contactForm', () => contactFormApp());

  Alpine.data('installApp', () => installApp());

  Alpine.data('appUpdate', () => updateApp());

  const daily = readJson<DailyPayload>('daily-data');
  if (daily) {
    Alpine.data('dailyQuestion', () => dailyQuestionApp(daily));
  }

  Alpine.data('speech', () => ({
    canSpeak() {
      return canUseSpeech();
    },
    speak(text: string, id: string) {
      const locale = (Alpine.store('i18n') as I18nStore).locale;
      toggleSpeak(text, locale, id);
    },
    speakChapter() {
      const root = (this as { $el: HTMLElement }).$el;
      const locale = (Alpine.store('i18n') as I18nStore).locale;
      const id = root.dataset.speakId || `chapter:${window.location.pathname}`;
      const langClass = locale === 'fr' ? 'lang-fr' : 'lang-en';
      const parts = [
        root.querySelector(`h1.${langClass}`),
        root.querySelector(`p.lede.${langClass}`),
        root.querySelector(`.prose.${langClass}`),
      ]
        .map((node) => node?.textContent?.replace(/\s+/g, ' ').trim())
        .filter((value): value is string => Boolean(value));
      if (parts.length === 0) {
        return;
      }
      toggleSpeak(parts.join('\n\n'), locale, id);
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

  const session = readJson<SessionPayload>('session-data');
  if (session) {
    Alpine.data('sessionPage', () => sessionApp(session));
  }

  const search = readJson<SearchDoc[]>('search-data');
  if (search) {
    Alpine.data('searchPage', () => searchApp(search));
  }
};
