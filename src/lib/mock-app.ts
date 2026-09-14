import type { RegionCode } from '../content/schema';
import type { ChapterOption, ClientQuestion } from './client-types';
import { drawMockQuestions } from './draw';
import { pickLocalized, t, type Locale, type LocalizedText } from './i18n';
import {
  allMockQuestionIds,
  lastMockAttempt,
  loadProgress,
  newAttemptId,
  recordAttempt,
  saveProgress,
  type Progress,
  type QuizAttempt,
} from './progress';

export const MOCK_LENGTH = 20;
export const MOCK_SECONDS = 45 * 60;
export const PASS_SCORE = 15;

export type MockPayload = {
  questions: ClientQuestion[];
  chapters: ChapterOption[];
};

function restoreMockQueue(questions: ClientQuestion[], attempt: QuizAttempt | null) {
  if (!attempt) {
    return [];
  }
  const byId = new Map(questions.map((question) => [question.id, question]));
  return attempt.questionIds.flatMap((id) => {
    const question = byId.get(id);
    if (!question) {
      return [];
    }
    const optionOrder = attempt.optionIdsByQuestion?.[id];
    const optionById = new Map(question.options.map((option) => [option.id, option]));
    const options = optionOrder
      ? optionOrder.flatMap((optionId) => {
          const option = optionById.get(optionId);
          return option ? [option] : [];
        })
      : [...question.options];
    return [
      {
        ...question,
        options: options.length === question.options.length ? options : [...question.options],
      },
    ];
  });
}

export function mockApp(payload: MockPayload) {
  return {
    chapters: payload.chapters,
    phase: 'intro' as 'intro' | 'exam' | 'review',
    queue: [] as ClientQuestion[],
    index: 0,
    selected: {} as Record<string, string>,
    flagged: {} as Record<string, boolean>,
    remaining: MOCK_SECONDS,
    warningShown: false,
    timerId: 0 as number | 0,
    startedAt: 0,
    score: 0,
    passed: false,
    saveFailed: false,
    autoSubmitted: false,
    progress: null as Progress | null,
    province: null as RegionCode | null,
    mockSeed: '',
    lastMockQueue: [] as ClientQuestion[],

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
      const loaded = loadProgress();
      this.progress = loaded.progress;
      this.province = loaded.progress.province;
      const attempt = lastMockAttempt(loaded.progress);
      this.mockSeed = attempt?.mockSeed ?? '';
      this.lastMockQueue = restoreMockQueue(payload.questions, attempt);
    },

    start() {
      if (!this.province) {
        return;
      }
      const progress = this.progress ?? loadProgress().progress;
      this.mockSeed = newAttemptId();
      const queue = drawMockQuestions(payload.questions, this.province, {
        avoidedIds: allMockQuestionIds(progress),
        preferredIds: new Set(progress.missedQuestionIds),
        seed: this.mockSeed,
      });
      this.begin(queue);
    },

    replayLast() {
      const queue = this.phase === 'review' ? this.queue : this.lastMockQueue;
      if (queue.length !== MOCK_LENGTH) {
        return;
      }
      this.begin(queue.map((question) => ({ ...question, options: [...question.options] })));
    },

    begin(queue: ClientQuestion[]) {
      this.queue = queue;
      this.index = 0;
      this.selected = {};
      this.flagged = {};
      this.remaining = MOCK_SECONDS;
      this.warningShown = false;
      this.autoSubmitted = false;
      this.startedAt = Date.now();
      this.phase = 'exam';
      this.tick();
      this.timerId = window.setInterval(() => this.tick(), 1000);
    },

    tick() {
      const elapsed = Math.floor((Date.now() - this.startedAt) / 1000);
      this.remaining = Math.max(0, MOCK_SECONDS - elapsed);
      if (this.remaining <= 5 * 60 && !this.warningShown) {
        this.warningShown = true;
      }
      if (this.remaining === 0) {
        this.submit(true);
      }
    },

    get clock(): string {
      const minutes = Math.floor(this.remaining / 60);
      const seconds = this.remaining % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    get current(): ClientQuestion | null {
      return this.queue[this.index] ?? null;
    },

    choose(optionId: string) {
      if (!this.current || this.phase !== 'exam') {
        return;
      }
      this.selected[this.current.id] = optionId;
    },

    onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('select, input, textarea, summary')) {
        return;
      }
      if (this.phase !== 'exam') {
        return;
      }
      if (event.key >= '1' && event.key <= '4') {
        event.preventDefault();
        const option = this.current?.options[Number(event.key) - 1];
        if (option) {
          this.choose(option.id);
        }
      }
    },

    jumpLabel(_question: ClientQuestion, itemIndex: number): string {
      return this.tx('practice.position', { n: itemIndex + 1, total: this.queue.length });
    },

    toggleFlag() {
      if (!this.current) {
        return;
      }
      this.flagged[this.current.id] = !this.flagged[this.current.id];
    },

    goTo(index: number) {
      if (index >= 0 && index < this.queue.length) {
        this.index = index;
      }
    },

    submit(auto = false) {
      if (this.phase !== 'exam') {
        return;
      }
      if (this.timerId) {
        window.clearInterval(this.timerId);
        this.timerId = 0;
      }
      this.autoSubmitted = auto;
      this.score = this.queue.filter(
        (question) => this.selected[question.id] === question.correctOptionId,
      ).length;
      this.passed = this.score >= PASS_SCORE;
      const loaded = loadProgress();
      const attempt = {
        id: newAttemptId(),
        date: new Date().toISOString(),
        mode: 'mock' as const,
        score: this.score,
        total: MOCK_LENGTH,
        questionIds: this.queue.map((question) => question.id),
        mockSeed: this.mockSeed,
        optionIdsByQuestion: Object.fromEntries(
          this.queue.map((question) => [
            question.id,
            question.options.map((option) => option.id),
          ]),
        ),
        answers: this.queue.map((question) => ({
          questionId: question.id,
          chapter: question.chapter,
          selectedOptionId: this.selected[question.id] ?? null,
          correct: this.selected[question.id] === question.correctOptionId,
        })),
      };
      this.progress = recordAttempt(loaded.progress, attempt);
      this.saveFailed = !saveProgress(this.progress);
      this.lastMockQueue = this.queue.map((question) => ({
        ...question,
        options: [...question.options],
      }));
      this.phase = 'review';
    },

    chapterBreakdown() {
      const rows = payload.chapters.map((chapter) => {
        const items = this.queue.filter((question) => question.chapter === chapter.id);
        const correct = items.filter(
          (question) => this.selected[question.id] === question.correctOptionId,
        ).length;
        return {
          title: this.pick(chapter.title),
          text: items.length === 0 ? '—' : `${correct}/${items.length}`,
        };
      });
      return rows.filter((row) => row.text !== '—');
    },

    resultLabel(question: ClientQuestion): string {
      const picked = this.selected[question.id];
      if (!picked) {
        return this.tx('mock.unanswered');
      }
      return picked === question.correctOptionId ? this.tx('practice.correct') : this.tx('practice.incorrect');
    },
  };
}

export type MockApp = ReturnType<typeof mockApp>;
