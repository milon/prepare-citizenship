import type { ChapterId } from '../content/schema';
import type { ChapterOption, ClientCard, ClientQuestion } from './client-types';
import { eligibleForProvince, shufflePractice } from './draw';
import { pickLocalized, speakText, t, type Locale, type LocalizedText } from './i18n';
import { isCardDue, markCorrect, markLearning } from './leitner';
import {
  loadProgress,
  newAttemptId,
  recordAttempt,
  saveProgress,
  weakestChapter,
  type Progress,
} from './progress';
import { shuffle } from './shuffle';

export const SESSION_CARD_N = 8;
export const SESSION_QUESTION_N = 8;
export const SESSION_SECONDS = 15 * 60;

export type SessionPayload = {
  cards: ClientCard[];
  questions: ClientQuestion[];
  chapters: ChapterOption[];
};

export function dueSessionCards(cards: ClientCard[], progress: Progress, n = SESSION_CARD_N): ClientCard[] {
  const province = progress.province;
  const scoped = province ? eligibleForProvince(cards, province) : cards;
  return shuffle(scoped.filter((card) => isCardDue(progress, card.id))).slice(0, n);
}

export function weakSessionQuestions(
  questions: ClientQuestion[],
  progress: Progress,
  n = SESSION_QUESTION_N,
): { questions: ClientQuestion[]; chapter: ChapterId | null; mixed: boolean } {
  const province = progress.province;
  const scoped = province ? eligibleForProvince(questions, province) : questions;
  const weak = weakestChapter(progress);
  const pool = weak ? scoped.filter((question) => question.chapter === weak) : scoped;
  const mixed = !weak;
  return {
    questions: shufflePractice(pool, Math.min(n, pool.length)),
    chapter: weak,
    mixed,
  };
}

export function formatClock(remaining: number): string {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

type Phase = 'cards' | 'quiz' | 'done';

export function sessionApp(payload: SessionPayload) {
  return {
    phase: 'cards' as Phase,
    cards: [] as ClientCard[],
    cardIndex: 0,
    flipped: false,
    questions: [] as ClientQuestion[],
    questionIndex: 0,
    selected: null as string | null,
    revealed: false,
    answers: [] as {
      questionId: string;
      chapter: ChapterId;
      selectedOptionId: string | null;
      correct: boolean;
    }[],
    score: 0,
    remaining: SESSION_SECONDS,
    timerId: 0 as number | 0,
    timedOut: false,
    saveFailed: false,
    progress: null as Progress | null,
    weakChapter: null as ChapterId | null,
    mixedQuiz: false,
    status: '',
    cardsDone: 0,
    cardsLearning: 0,

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

    locale(): Locale {
      return ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n?.locale ??
        'en') as Locale;
    },

    init() {
      this.progress = loadProgress().progress;
      this.cards = dueSessionCards(payload.cards, this.progress);
      const quiz = weakSessionQuestions(payload.questions, this.progress);
      this.questions = quiz.questions;
      this.weakChapter = quiz.chapter;
      this.mixedQuiz = quiz.mixed;
      this.phase = this.cards.length > 0 ? 'cards' : this.questions.length > 0 ? 'quiz' : 'done';
      if (this.phase !== 'done') {
        this.startTimer();
      }
    },

    startTimer() {
      this.clearTimer();
      this.remaining = SESSION_SECONDS;
      this.timerId = window.setInterval(() => {
        this.remaining = Math.max(0, this.remaining - 1);
        if (this.remaining === 0) {
          this.timedOut = true;
          this.clearTimer();
        }
      }, 1000);
    },

    clearTimer() {
      if (this.timerId) {
        window.clearInterval(this.timerId);
        this.timerId = 0;
      }
    },

    get clock(): string {
      return formatClock(this.remaining);
    },

    get currentCard(): ClientCard | null {
      return this.cards[this.cardIndex] ?? null;
    },

    get currentQuestion(): ClientQuestion | null {
      return this.questions[this.questionIndex] ?? null;
    },

    get cardPosition(): string {
      if (this.cards.length === 0) {
        return this.tx('session.noCards');
      }
      return this.tx('cards.of', { n: this.cardIndex + 1, total: this.cards.length });
    },

    get questionPosition(): string {
      if (this.questions.length === 0) {
        return this.tx('practice.none');
      }
      return this.tx('practice.position', {
        n: this.questionIndex + 1,
        total: this.questions.length,
      });
    },

    canSpeak() {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    },

    speakCurrent() {
      if (this.phase === 'cards' && this.currentCard) {
        const text = this.flipped
          ? this.pick(this.currentCard.back)
          : this.pick(this.currentCard.front);
        speakText(text, this.locale());
        return;
      }
      if (this.phase === 'quiz' && this.currentQuestion) {
        speakText(this.pick(this.currentQuestion.prompt), this.locale());
      }
    },

    flip() {
      this.flipped = !this.flipped;
    },

    persist() {
      if (!this.progress) {
        return;
      }
      this.saveFailed = !saveProgress(this.progress);
    },

    skipRestIfTimedOut(after: () => void) {
      if (this.timedOut) {
        this.finish();
        return;
      }
      after();
    },

    rateCard(knew: boolean) {
      if (!this.progress || !this.currentCard) {
        return;
      }
      const id = this.currentCard.id;
      if (knew) {
        this.progress.flashcardState[id] = markCorrect(this.progress.flashcardState[id]);
        this.progress.missedQuestionIds = this.progress.missedQuestionIds.filter((item) => item !== id);
        this.cardsDone += 1;
      } else {
        this.progress.flashcardState[id] = markLearning(this.progress.flashcardState[id]);
        if (!this.progress.missedQuestionIds.includes(id)) {
          this.progress.missedQuestionIds.push(id);
        }
        this.cardsLearning += 1;
      }
      this.persist();
      this.cards.splice(this.cardIndex, 1);
      this.flipped = false;
      if (this.cardIndex >= this.cards.length) {
        this.cardIndex = Math.max(0, this.cards.length - 1);
      }
      this.skipRestIfTimedOut(() => {
        if (this.cards.length === 0) {
          this.phase = this.questions.length > 0 ? 'quiz' : 'done';
          if (this.phase === 'done') {
            this.finish();
          }
        }
      });
    },

    choose(optionId: string) {
      if (this.revealed || !this.currentQuestion) {
        return;
      }
      this.selected = optionId;
      this.revealed = true;
      const correct = optionId === this.currentQuestion.correctOptionId;
      this.answers.push({
        questionId: this.currentQuestion.id,
        chapter: this.currentQuestion.chapter,
        selectedOptionId: optionId,
        correct,
      });
      if (correct) {
        this.score += 1;
      }
    },

    optionState(optionId: string): string {
      if (!this.revealed || !this.currentQuestion) {
        return '';
      }
      if (optionId === this.currentQuestion.correctOptionId) {
        return 'correct';
      }
      if (optionId === this.selected) {
        return 'incorrect';
      }
      return '';
    },

    nextQuestion() {
      if (!this.revealed) {
        return;
      }
      this.skipRestIfTimedOut(() => {
        if (this.questionIndex < this.questions.length - 1) {
          this.questionIndex += 1;
          this.selected = null;
          this.revealed = false;
          return;
        }
        this.finish();
      });
    },

    finish() {
      this.clearTimer();
      this.phase = 'done';
      if (this.answers.length === 0) {
        return;
      }
      const loaded = loadProgress();
      const attempt = {
        id: newAttemptId(),
        date: new Date().toISOString(),
        mode: 'practice' as const,
        score: this.score,
        total: this.answers.length,
        questionIds: this.answers.map((answer) => answer.questionId),
        answers: this.answers,
      };
      this.progress = recordAttempt(loaded.progress, attempt);
      this.saveFailed = !saveProgress(this.progress);
    },
  };
}
