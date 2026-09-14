import type { ChapterId } from '../content/schema';
import type { ChapterOption, ClientCard } from './client-types';
import { boxLabel, defaultCardState, isCardDue, markCorrect, markKnown, markLearning } from './leitner';
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
    progress: null as Progress | null,
    saveFailed: false,
    storageAvailable: true,
    status: '',

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
      const cards =
        this.chapter === 'all'
          ? payload.cards
          : payload.cards.filter((card) => card.chapter === this.chapter);
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
      this.index = 0;
      this.flipped = false;
      this.status = '';
    },

    get current(): ClientCard | null {
      return this.deck[this.index] ?? null;
    },

    get boxText(): string {
      if (!this.current || !this.progress) {
        return 'Learning';
      }
      const state = this.progress.flashcardState[this.current.id] ?? defaultCardState();
      return boxLabel(state.box);
    },

    get position(): string {
      if (this.deck.length === 0) {
        return 'No cards';
      }
      return `${this.index + 1} of ${this.deck.length}`;
    },

    flip() {
      this.flipped = !this.flipped;
      this.status = this.flipped ? 'Answer showing' : 'Prompt showing';
    },

    next() {
      if (this.index < this.deck.length - 1) {
        this.index += 1;
        this.flipped = false;
        this.status = 'Prompt showing';
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
      this.status = this.deck.length === 0 ? 'Deck complete' : 'Prompt showing';
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
  };
}
