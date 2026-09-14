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
  seenQuestions: number;
  cardsDue: number;
  mocksPassed: number;
  mockTrend: { date: string; score: number; total: number; passed: boolean }[];
  chapters: ChapterStat[];
  readiness: Readiness;
  recommendation: Recommendation;
};

export type Recommendation = {
  kind: 'read' | 'mock' | 'drill' | 'cards' | 'maintain';
  title: string;
  blurb: string;
  cta: string;
  altCta: string;
  chapterId: ChapterId | null;
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

export function seenQuestionCount(progress: Progress): number {
  const seen = new Set<string>();
  for (const attempt of progress.quizAttempts) {
    for (const answer of attempt.answers) {
      seen.add(answer.questionId);
    }
  }
  return seen.size;
}

/**
 * A card with no saved state counts as due, matching `isCardDue`.
 */
export function dueCardCount(progress: Progress, totalCards: number, today = todayStamp()): number {
  const tracked = Object.values(progress.flashcardState);
  const dueTracked = tracked.filter((record) => record.due <= today).length;
  const untracked = Math.max(0, totalCards - tracked.length);
  return dueTracked + untracked;
}

export function recommendationFor(
  stats: Omit<DashboardStats, 'recommendation'>,
): Recommendation {
  const weakest = [...stats.chapters]
    .filter((chapter) => chapter.status === 'weak')
    .sort((a, b) => a.rate - b.rate)[0];
  const mocksCompleted = stats.mockTrend.length;

  if (stats.seenQuestions === 0) {
    return {
      kind: 'read',
      title: 'Start with chapter one',
      blurb:
        'Read Rights and Responsibilities, then drill the same material as flashcards. Ten minutes is enough for a first session.',
      cta: 'Read the chapter',
      altCta: 'Try a practice quiz',
      chapterId: CHAPTERS[0].id,
    };
  }

  if (mocksCompleted < MOCKS_FOR_READINESS) {
    return {
      kind: 'mock',
      title: mocksCompleted === 0 ? 'Sit your first mock exam' : `Sit mock exam #${mocksCompleted + 1}`,
      blurb: `20 questions, 45 minutes, ${MOCK_PASS_SCORE} to pass — the same shape as the real test. Readiness needs ${MOCKS_FOR_READINESS} passes.`,
      cta: 'Start mock exam',
      altCta: 'Practice 10 instead',
      chapterId: null,
    };
  }

  if (weakest) {
    return {
      kind: 'drill',
      title: `Drill ${weakest.title}`,
      blurb: `It is at ${percent(weakest.rate)} after ${weakest.total} answers, below the 70% you want before the test.`,
      cta: 'Practice this chapter',
      altCta: 'Flashcards for it',
      chapterId: weakest.id,
    };
  }

  if (stats.cardsDue > 0) {
    return {
      kind: 'cards',
      title: `${stats.cardsDue} flashcard${stats.cardsDue === 1 ? '' : 's'} due`,
      blurb: 'Clear today’s box to keep the spaced schedule honest, then take a quiz.',
      cta: 'Review cards',
      altCta: 'Practice quiz',
      chapterId: null,
    };
  }

  return {
    kind: 'maintain',
    title: 'You are tracking well',
    blurb: 'Nothing is overdue. Keep the streak alive with a short set, or sit another mock to confirm.',
    cta: 'Practice quiz',
    altCta: 'Mock exam',
    chapterId: null,
  };
}

export function dashboardStats(
  progress: Progress,
  totalCards = 0,
  today = todayStamp(),
): DashboardStats {
  let overallCorrect = 0;
  let overallTotal = 0;
  for (const attempt of progress.quizAttempts) {
    overallCorrect += attempt.score;
    overallTotal += attempt.total;
  }

  const mockTrend = mocks(progress).map((attempt) => ({
    date: attempt.date.slice(0, 10),
    score: attempt.score,
    total: attempt.total,
    passed: attempt.score >= MOCK_PASS_SCORE,
  }));

  const base = {
    overallCorrect,
    overallTotal,
    overallRate: overallTotal === 0 ? 0 : overallCorrect / overallTotal,
    streak: currentStreak(progress, today),
    seenQuestions: seenQuestionCount(progress),
    cardsDue: dueCardCount(progress, totalCards, today),
    mocksPassed: mockTrend.filter((attempt) => attempt.passed).length,
    mockTrend,
    chapters: chapterStats(progress),
    readiness: readinessFor(progress),
  };

  return { ...base, recommendation: recommendationFor(base) };
}

export function percent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
