import type { Alpine } from 'alpinejs';
import { flashcardsApp, type FlashcardsPayload } from './lib/flashcards-app';
import { mockApp, type MockPayload } from './lib/mock-app';
import { practiceApp, type PracticePayload } from './lib/practice-app';
import { provincePickerApp, settingsApp } from './lib/province-app';
import { loadProgress } from './lib/progress';

function readJson<T>(id: string): T | null {
  const element = document.getElementById(id);
  if (!element?.textContent) {
    return null;
  }
  return JSON.parse(element.textContent) as T;
}

export default (Alpine: Alpine) => {
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
