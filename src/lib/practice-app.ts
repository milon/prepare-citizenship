import type { ChapterId } from '../content/schema';
import type { ChapterOption, ClientQuestion } from './client-types';
import { shufflePractice } from './draw';
import {
  loadProgress,
  newAttemptId,
  recordAttempt,
  saveProgress,
  weakestChapter,
  type Progress,
} from './progress';

export type PracticePayload = {
  questions: ClientQuestion[];
  chapters: ChapterOption[];
  initialChapter: ChapterId | 'all' | 'weakest';
  size: number;
};

export function practiceApp(payload: PracticePayload) {
  return {
    chapters: payload.chapters,
    chapter: payload.initialChapter,
    index: 0,
    selected: null as string | null,
    revealed: false,
    queue: [] as ClientQuestion[],
    answers: [] as { questionId: string; chapter: ChapterId; selectedOptionId: string | null; correct: boolean }[],
    finished: false,
    score: 0,
    saveFailed: false,
    warning: '',
    progress: null as Progress | null,

    init() {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('chapter');
      if (requested === 'weakest' || requested === 'all') {
        this.chapter = requested;
      } else if (requested && payload.chapters.some((chapter) => chapter.id === requested)) {
        this.chapter = requested as ChapterId;
      }
      this.progress = loadProgress().progress;
      this.start();
    },

    start() {
      this.finished = false;
      this.score = 0;
      this.answers = [];
      this.index = 0;
      this.selected = null;
      this.revealed = false;
      this.warning = '';

      let pool = payload.questions;
      if (this.chapter === 'weakest') {
        const weakest = this.progress ? weakestChapter(this.progress) : null;
        if (!weakest) {
          this.warning = 'Not enough quiz data yet for a weakest-chapter set. Showing a mixed practice instead.';
        } else {
          pool = payload.questions.filter((question) => question.chapter === weakest);
          this.warning = `Practicing your weakest chapter so far.`;
        }
      } else if (this.chapter !== 'all') {
        pool = payload.questions.filter((question) => question.chapter === this.chapter);
      }

      this.queue = shufflePractice(pool, Math.min(payload.size, pool.length));
    },

    get current(): ClientQuestion | null {
      return this.queue[this.index] ?? null;
    },

    get position(): string {
      if (this.queue.length === 0) {
        return 'No questions';
      }
      return `Question ${this.index + 1} of ${this.queue.length}`;
    },

    choose(optionId: string) {
      if (this.revealed || !this.current) {
        return;
      }
      this.selected = optionId;
      this.revealed = true;
      const correct = optionId === this.current.correctOptionId;
      this.answers.push({
        questionId: this.current.id,
        chapter: this.current.chapter,
        selectedOptionId: optionId,
        correct,
      });
      if (correct) {
        this.score += 1;
      }
    },

    next() {
      if (!this.revealed) {
        return;
      }
      if (this.index < this.queue.length - 1) {
        this.index += 1;
        this.selected = null;
        this.revealed = false;
        return;
      }
      this.finish();
    },

    finish() {
      this.finished = true;
      const loaded = loadProgress();
      const attempt = {
        id: newAttemptId(),
        date: new Date().toISOString(),
        mode: 'practice' as const,
        score: this.score,
        total: this.queue.length,
        questionIds: this.queue.map((question) => question.id),
        answers: this.answers,
      };
      this.progress = recordAttempt(loaded.progress, attempt);
      this.saveFailed = !saveProgress(this.progress);
    },

    optionState(optionId: string): string {
      if (!this.revealed || !this.current) {
        return '';
      }
      if (optionId === this.current.correctOptionId) {
        return 'correct';
      }
      if (optionId === this.selected) {
        return 'incorrect';
      }
      return '';
    },

    currentBreakdown() {
      const counts = new Map<ChapterId, { correct: number; total: number }>();
      for (const answer of this.answers) {
        const row = counts.get(answer.chapter) ?? { correct: 0, total: 0 };
        row.total += 1;
        if (answer.correct) {
          row.correct += 1;
        }
        counts.set(answer.chapter, row);
      }
      return payload.chapters
        .filter((chapter) => counts.has(chapter.id))
        .map((chapter) => {
          const row = counts.get(chapter.id);
          return { title: chapter.title, text: `${row?.correct ?? 0}/${row?.total ?? 0}` };
        });
    },
  };
}
