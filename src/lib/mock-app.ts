import type { RegionCode } from '../content/schema';
import type { ChapterOption, ClientQuestion } from './client-types';
import { drawMockQuestions } from './draw';
import {
  lastMockQuestionIds,
  loadProgress,
  newAttemptId,
  recordAttempt,
  saveProgress,
  type Progress,
} from './progress';

export const MOCK_LENGTH = 20;
export const MOCK_SECONDS = 45 * 60;
export const PASS_SCORE = 15;

export type MockPayload = {
  questions: ClientQuestion[];
  chapters: ChapterOption[];
};

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

    init() {
      const loaded = loadProgress();
      this.progress = loaded.progress;
      this.province = loaded.progress.province;
    },

    start() {
      if (!this.province) {
        return;
      }
      const recent = this.progress ? lastMockQuestionIds(this.progress) : new Set<string>();
      this.queue = drawMockQuestions(payload.questions, this.province, recent);
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

    jumpLabel(question: ClientQuestion, itemIndex: number): string {
      const parts = [`Question ${itemIndex + 1}`];
      if (this.selected[question.id]) {
        parts.push('answered');
      }
      if (this.flagged[question.id]) {
        parts.push('flagged');
      }
      if (itemIndex === this.index) {
        parts.push('current');
      }
      return parts.join(', ');
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
        answers: this.queue.map((question) => ({
          questionId: question.id,
          chapter: question.chapter,
          selectedOptionId: this.selected[question.id] ?? null,
          correct: this.selected[question.id] === question.correctOptionId,
        })),
      };
      this.progress = recordAttempt(loaded.progress, attempt);
      this.saveFailed = !saveProgress(this.progress);
      this.phase = 'review';
    },

    chapterBreakdown() {
      const rows = payload.chapters.map((chapter) => {
        const items = this.queue.filter((question) => question.chapter === chapter.id);
        const correct = items.filter(
          (question) => this.selected[question.id] === question.correctOptionId,
        ).length;
        return {
          title: chapter.title,
          text: items.length === 0 ? '—' : `${correct}/${items.length}`,
        };
      });
      return rows.filter((row) => row.text !== '—');
    },

    resultLabel(question: ClientQuestion): string {
      const picked = this.selected[question.id];
      if (!picked) {
        return 'Unanswered';
      }
      return picked === question.correctOptionId ? 'Correct' : 'Incorrect';
    },
  };
}

export type MockApp = ReturnType<typeof mockApp>;
