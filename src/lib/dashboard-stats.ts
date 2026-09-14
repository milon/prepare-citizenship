import type { ChapterId } from '../content/schema';
import { CHAPTERS, chapterTitle } from './chapters';
import { addDays, todayStamp } from './dates';
import { chapterAccuracy, type Progress, type QuizAttempt } from './progress';

export const MOCK_PASS_SCORE = 15;
export const MOCKS_FOR_READINESS = 3;
export const CHAPTER_ANSWER_FLOOR = 10;
export const CHAPTER_READY_RATE = 0.7;

export type ChapterStat = {
  id: ChapterId;
  title: string;
  correct: number;
  total: number;
  rate: number;
  status: 'keep-practicing' | 'on-track' | 'weak';
};

export type Readiness =
  | { status: 'not-enough-data'; mocksCompleted: number }
  | { status: 'ready'; keepPracticing: ChapterStat[] }
  | {
      status: 'not-ready';
      reasons: string[];
      keepPracticing: ChapterStat[];
      weakChapters: ChapterStat[];
    };

export type DashboardStats = {
  overallCorrect: number;
  overallTotal: number;
  overallRate: number;
  streak: number;
  mockTrend: { date: string; score: number; total: number; passed: boolean }[];
  chapters: ChapterStat[];
  readiness: Readiness;
};

function mocks(progress: Progress): QuizAttempt[] {
  return progress.quizAttempts.filter((attempt) => attempt.mode === 'mock');
}

function studyDates(progress: Progress): Set<string> {
  const dates = new Set<string>();
  for (const attempt of progress.quizAttempts) {
    dates.add(attempt.date.slice(0, 10));
  }
  for (const record of Object.values(progress.flashcardState)) {
    dates.add(record.lastSeen.slice(0, 10));
  }
  return dates;
}

export function currentStreak(progress: Progress, today = todayStamp()): number {
  const dates = studyDates(progress);
  let cursor = dates.has(today) ? today : addDays(today, -1);
  if (!dates.has(cursor)) {
    return 0;
  }
  let count = 0;
  while (dates.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

function chapterStats(progress: Progress): ChapterStat[] {
  const accuracy = chapterAccuracy(progress);
  return CHAPTERS.map((chapter) => {
    const value = accuracy[chapter.id] ?? { correct: 0, total: 0, rate: 0 };
    let status: ChapterStat['status'] = 'keep-practicing';
    if (value.total >= CHAPTER_ANSWER_FLOOR) {
      status = value.rate >= CHAPTER_READY_RATE ? 'on-track' : 'weak';
    }
    return {
      id: chapter.id,
      title: chapter.title,
      correct: value.correct,
      total: value.total,
      rate: value.rate,
      status,
    };
  });
}

export function readinessFor(progress: Progress): Readiness {
  const completed = mocks(progress);
  const keepPracticing = chapterStats(progress).filter(
    (chapter) => chapter.status === 'keep-practicing' && chapter.total > 0,
  );
  if (completed.length < MOCKS_FOR_READINESS) {
    return { status: 'not-enough-data', mocksCompleted: completed.length };
  }

  const recent = completed.slice(-MOCKS_FOR_READINESS);
  const weakChapters = chapterStats(progress).filter((chapter) => chapter.status === 'weak');
  const failedRecent = recent.some((attempt) => attempt.score < MOCK_PASS_SCORE);
  const reasons: string[] = [];
  if (failedRecent) {
    reasons.push('A recent mock scored below 15/20.');
  }
  for (const chapter of weakChapters) {
    reasons.push(
      `${chapterTitle(chapter.id)} is at ${Math.round(chapter.rate * 100)}% after ${chapter.total} answers (need 70%).`,
    );
  }

  if (!failedRecent && weakChapters.length === 0) {
    return { status: 'ready', keepPracticing };
  }
  return { status: 'not-ready', reasons, keepPracticing, weakChapters };
}

export function dashboardStats(progress: Progress, today = todayStamp()): DashboardStats {
  let overallCorrect = 0;
  let overallTotal = 0;
  for (const attempt of progress.quizAttempts) {
    overallCorrect += attempt.score;
    overallTotal += attempt.total;
  }

  return {
    overallCorrect,
    overallTotal,
    overallRate: overallTotal === 0 ? 0 : overallCorrect / overallTotal,
    streak: currentStreak(progress, today),
    mockTrend: mocks(progress).map((attempt) => ({
      date: attempt.date.slice(0, 10),
      score: attempt.score,
      total: attempt.total,
      passed: attempt.score >= MOCK_PASS_SCORE,
    })),
    chapters: chapterStats(progress),
    readiness: readinessFor(progress),
  };
}

export function percent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
