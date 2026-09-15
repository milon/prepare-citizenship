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
  stopSpeaking,
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
  speak(text: string, id: string): void;
  speakChapter(root: HTMLElement, explicitId?: string): void;
};

function chapterSpeechText(root: HTMLElement, locale: Locale): string {
  const langClass = locale === 'fr' ? 'lang-fr' : 'lang-en';
  return [
    root.querySelector(`h1.${langClass}`),
    root.querySelector(`p.lede.${langClass}`),
    root.querySelector(`.prose.${langClass}`),
  ]
    .map((node) => node?.textContent?.replace(/\s+/g, ' ').trim())
    .filter((value): value is string => Boolean(value))
    .join('\n\n');
}

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
    speak(text: string, id: string) {
      const locale = (Alpine.store('i18n') as I18nStore).locale;
      toggleSpeak(text, locale, id);
    },
    speakChapter(root: HTMLElement, explicitId?: string) {
      const locale = (Alpine.store('i18n') as I18nStore).locale;
      const id =
        explicitId ||
        root.dataset.speakId ||
        `chapter:${window.location.pathname.replace(/\/+$/, '').split('/').pop()}`;
      const text = chapterSpeechText(root, locale);
      if (!text) {
        return;
      }
      toggleSpeak(text, locale, id);
    },
  } satisfies SpeechStore);
  subscribeSpeak((state) => {
    const store = Alpine.store('speech') as SpeechStore;
    store.playing = state.playing;
    store.loading = state.loading;
    store.id = state.id;
  });
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      window.speechSynthesis.getVoices();
    });
    // Full page navigations and tab discard should never leave speech running.
    window.addEventListener('pagehide', () => {
      stopSpeaking();
    });
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        // Native chapter speak — same call stack as the user gesture (required by
        // Web Speech in Safari/Chrome). Must run before link handling.
        const speakBtn = target.closest('[data-pc-speak="chapter"]');
        if (speakBtn instanceof HTMLElement) {
          const root =
            speakBtn.closest<HTMLElement>('[data-speak-id]') ||
            speakBtn.closest<HTMLElement>('.chapter-article');
          if (root) {
            const id = speakBtn.dataset.pcSpeakId || root.dataset.speakId;
            (Alpine.store('speech') as SpeechStore).speakChapter(root, id);
          }
          return;
        }

        const link = target.closest('a[href]');
        if (!(link instanceof HTMLAnchorElement)) {
          return;
        }
        if (link.target === '_blank' || link.hasAttribute('download')) {
          return;
        }
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }
        try {
          const url = new URL(link.href, window.location.href);
          if (url.origin !== window.location.origin) {
            return;
          }
          if (url.pathname === window.location.pathname && url.search === window.location.search) {
            return;
          }
        } catch {
          return;
        }
        stopSpeaking();
      },
      true,
    );
  }

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
      (Alpine.store('speech') as SpeechStore).speak(text, id);
    },
    speakChapter(explicitId?: string) {
      const root = (this as { $el: HTMLElement }).$el;
      (Alpine.store('speech') as SpeechStore).speakChapter(root, explicitId);
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
