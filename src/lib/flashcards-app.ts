import type { ChapterId, RegionCode } from '../content/schema';
import type { ChapterOption, ClientCard } from './client-types';
import { eligibleForProvince } from './draw';
import { pickLocalized, toggleSpeak, canUseSpeech, t, type Locale, type LocalizedText } from './i18n';
import { defaultCardState, isCardDue, markCorrect, markKnown, markLearning } from './leitner';
import {
  loadProgress,
  saveProgress,
  type LoadResult,
  type Progress,
} from './progress';
import { shuffle } from './shuffle';

export type FlashcardsPayload = {
  cards: ClientCard[];
  chapters: ChapterOption[];
  initialChapter: ChapterId | 'all';
};

type Mode = 'due' | 'shuffle' | 'mistakes';

export function flashcardsApp(payload: FlashcardsPayload) {
  return {
    chapters: payload.chapters,
    chapter: payload.initialChapter,
    mode: 'due' as Mode,
    index: 0,
    flipped: false,
    deck: [] as ClientCard[],
    sessionTotal: 0,
    progress: null as Progress | null,
    saveFailed: false,
    storageAvailable: true,
    status: '',

    tx(key: string, vars?: Record<string, string | number>) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return t(key, locale, vars);
    },

    pick(value: LocalizedText | string) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return pickLocalized(value, locale);
    },

    init() {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('chapter');
      if (requested && payload.chapters.some((chapter) => chapter.id === requested)) {
        this.chapter = requested as typeof this.chapter;
      }
      this.refreshProgress();
      this.rebuild();
    },

    refreshProgress() {
      const loaded: LoadResult = loadProgress();
      this.progress = loaded.progress;
      this.saveFailed = loaded.saveFailed;
      this.storageAvailable = loaded.storageAvailable;
    },

    persist() {
      if (!this.progress) {
        return;
      }
      this.saveFailed = !saveProgress(this.progress);
    },

    filtered(): ClientCard[] {
      const province = this.progress?.province as RegionCode | null | undefined;
      const scoped = province ? eligibleForProvince(payload.cards, province) : payload.cards;
      const cards =
        this.chapter === 'all'
          ? scoped
          : scoped.filter((card) => card.chapter === this.chapter);
      if (!this.progress) {
        return cards;
      }
      if (this.mode === 'mistakes') {
        const missed = new Set(this.progress.missedQuestionIds);
        return cards.filter((card) => missed.has(card.id));
      }
      if (this.mode === 'due') {
        return cards.filter((card) => isCardDue(this.progress as Progress, card.id));
      }
      return cards;
    },

    rebuild() {
      const list = this.filtered();
      this.deck = this.mode === 'due' ? list : shuffle(list);
      this.sessionTotal = this.deck.length;
      this.index = 0;
      this.flipped = false;
      this.status = '';
    },

    get printCards(): ClientCard[] {
      return this.filtered();
    },

    get current(): ClientCard | null {
      return this.deck[this.index] ?? null;
    },

    get boxText(): string {
      if (!this.current || !this.progress) {
        return this.tx('cards.box1');
      }
      const state = this.progress.flashcardState[this.current.id] ?? defaultCardState();
      return this.tx(`cards.box${state.box}` as 'cards.box1' | 'cards.box2' | 'cards.box3');
    },

    get remainingText(): string {
      if (this.deck.length === 0) {
        return this.tx('cards.noCards');
      }
      return this.tx('cards.left', { n: this.deck.length });
    },

    get progressPercent(): number {
      if (this.sessionTotal <= 0) {
        return 0;
      }
      const done = this.sessionTotal - this.deck.length;
      if (done <= 0) {
        return 0;
      }
      // Keep the first card visible on the bar; Math.round alone stays 0 for ages.
      return Math.min(100, Math.max(1, Math.round((done / this.sessionTotal) * 100)));
    },

    flip() {
      this.flipped = !this.flipped;
      this.status = this.flipped ? this.tx('cards.statusAnswer') : this.tx('cards.statusPrompt');
    },

    /* The card element is reused across cards, so deal the next one in by hand. */
    dealIn() {
      const card = (this as { $refs?: Record<string, HTMLElement | undefined> }).$refs?.card;
      if (!card) {
        return;
      }
      // A rated card is already back on its prompt side, so snap rather than unflip.
      card.classList.add('is-instant');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => card.classList.remove('is-instant'));
      });
      if (!card.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      card.animate(
        [
          { opacity: 0, transform: 'translateY(0.6rem) scale(0.97)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 240, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
      );
    },

    next() {
      if (this.index < this.deck.length - 1) {
        this.index += 1;
        this.flipped = false;
        this.status = this.tx('cards.statusPrompt');
        this.dealIn();
        return;
      }
      this.rebuild();
    },

    apply(mutator: (progress: Progress, cardId: string) => void) {
      if (!this.progress || !this.current) {
        return;
      }
      mutator(this.progress, this.current.id);
      this.persist();
      this.deck.splice(this.index, 1);
      this.flipped = false;
      if (this.index >= this.deck.length) {
        this.index = Math.max(0, this.deck.length - 1);
      }
      this.status = this.deck.length === 0 ? this.tx('cards.statusDone') : this.tx('cards.statusPrompt');
      this.dealIn();
    },

    gotIt() {
      this.apply((progress, cardId) => {
        progress.flashcardState[cardId] = markCorrect(progress.flashcardState[cardId]);
        progress.missedQuestionIds = progress.missedQuestionIds.filter((id) => id !== cardId);
      });
    },

    stillLearning() {
      this.apply((progress, cardId) => {
        progress.flashcardState[cardId] = markLearning(progress.flashcardState[cardId]);
        if (!progress.missedQuestionIds.includes(cardId)) {
          progress.missedQuestionIds.push(cardId);
        }
      });
    },

    markAsKnown() {
      this.apply((progress, cardId) => {
        progress.flashcardState[cardId] = markKnown();
        progress.missedQuestionIds = progress.missedQuestionIds.filter((id) => id !== cardId);
      });
    },

    setChapter(chapter: ChapterId | 'all') {
      this.chapter = chapter;
      this.rebuild();
    },

    setMode(mode: Mode) {
      this.mode = mode;
      this.rebuild();
    },

    canSpeak() {
      return canUseSpeech();
    },

    speakId() {
      if (!this.current) {
        return '';
      }
      return `cards:${this.current.id}:${this.flipped ? 'back' : 'front'}`;
    },

    speakCurrent() {
      if (!this.current) {
        return;
      }
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      const text = this.flipped ? this.pick(this.current.back) : this.pick(this.current.front);
      toggleSpeak(text, locale, this.speakId());
    },
  };
}
