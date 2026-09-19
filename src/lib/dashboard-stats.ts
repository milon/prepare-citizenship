import type { ChapterId } from '../content/schema';
import { CHAPTERS } from './chapters';
import { addDays, todayStamp } from './dates';
import { chapterAccuracy, type Progress, type QuizAttempt } from './progress';

export const MOCK_PASS_SCORE = 15;
export const MOCKS_FOR_READINESS = 3;
export const CHAPTER_ANSWER_FLOOR = 10;
export const CHAPTER_READY_RATE = 0.7;
/** Share of readiness score from chapter practice (rest is mocks). */
export const READINESS_CHAPTER_WEIGHT = 0.6;
/** Seen quiz answers before we push the first mock. */
export const MOCK_SEEN_FLOOR = 25;
/** Distinct chapters with any answers before we push the first mock. */
export const MOCK_CHAPTER_FLOOR = 2;

export type ChapterStat = {
  id: ChapterId;
  title: string;
  correct: number;
  total: number;
  rate: number;
  status: 'keep-practicing' | 'on-track' | 'weak';
};

export type ReadinessReason =
  | { id: 'mock' }
  | { id: 'chapter'; chapterId: ChapterId; rate: number; total: number }
  | { id: 'chapter-thin'; chapterId: ChapterId; total: number; need: number };

export type Readiness =
  | { status: 'not-enough-data'; mocksCompleted: number; percent: number }
  | { status: 'ready'; keepPracticing: ChapterStat[]; percent: 100 }
  | {
      status: 'not-ready';
      reasons: ReadinessReason[];
      keepPracticing: ChapterStat[];
      weakChapters: ChapterStat[];
      percent: number;
    };

export type DashboardStats = {
  overallCorrect: number;
  overallTotal: number;
  overallRate: number;
  streak: number;
  seenQuestions: number;
  cardsDue: number;
  flashcardsStarted: boolean;
  mocksPassed: number;
  mockTrend: { date: string; score: number; total: number; passed: boolean }[];
  chapters: ChapterStat[];
  readiness: Readiness;
  recommendation: Recommendation;
};

export type Recommendation = {
  kind: 'read' | 'session' | 'mock' | 'drill' | 'cards' | 'maintain';
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

/**
 * Per-chapter progress toward on-track (0–1). Never reaches 1 unless the chapter
 * has the answer floor and ≥70% accuracy.
 */
export function chapterReadinessProgress(chapter: ChapterStat): number {
  if (chapter.status === 'on-track') {
    return 1;
  }
  if (chapter.total <= 0) {
    return 0;
  }
  const rateFactor = Math.min(chapter.rate / CHAPTER_READY_RATE, 1);
  if (chapter.total < CHAPTER_ANSWER_FLOOR) {
    return (chapter.total / CHAPTER_ANSWER_FLOOR) * rateFactor * 0.85;
  }
  // Floor met but still weak — approach the bar without crossing it.
  return rateFactor * 0.9;
}

/**
 * Mock half of readiness (0–1): sitting three exams, then passing the last three.
 */
export function mockReadinessProgress(completed: QuizAttempt[]): number {
  const sitFraction = Math.min(completed.length, MOCKS_FOR_READINESS) / MOCKS_FOR_READINESS;
  if (completed.length < MOCKS_FOR_READINESS) {
    return sitFraction * 0.45;
  }
  const recent = completed.slice(-MOCKS_FOR_READINESS);
  const passFraction =
    recent.filter((attempt) => attempt.score >= MOCK_PASS_SCORE).length / MOCKS_FOR_READINESS;
  return sitFraction * 0.45 + passFraction * 0.55;
}

/**
 * Continuous readiness 0–100. Hits 100 only when every chapter is on-track and the
 * last three mocks all passed. Otherwise capped at 99 so the dial never lies.
 */
export function readinessPercentFor(
  chapters: ChapterStat[],
  completedMocks: QuizAttempt[],
  isReady: boolean,
): number {
  if (isReady) {
    return 100;
  }
  const chapterAvg =
    chapters.length === 0
      ? 0
      : chapters.reduce((sum, chapter) => sum + chapterReadinessProgress(chapter), 0) /
        chapters.length;
  const mockProgress = mockReadinessProgress(completedMocks);
  const raw =
    chapterAvg * READINESS_CHAPTER_WEIGHT + mockProgress * (1 - READINESS_CHAPTER_WEIGHT);
  return Math.min(99, Math.round(raw * 100));
}

export function readinessFor(progress: Progress): Readiness {
  const completed = mocks(progress);
  const chapters = chapterStats(progress);
  const keepPracticing = chapters.filter(
    (chapter) => chapter.status === 'keep-practicing' && chapter.total > 0,
  );
  const incompleteChapters = chapters.filter((chapter) => chapter.status !== 'on-track');
  const weakChapters = chapters.filter((chapter) => chapter.status === 'weak');
  const recent =
    completed.length >= MOCKS_FOR_READINESS ? completed.slice(-MOCKS_FOR_READINESS) : [];
  const failedRecent =
    recent.length === MOCKS_FOR_READINESS &&
    recent.some((attempt) => attempt.score < MOCK_PASS_SCORE);
  const mocksOk =
    completed.length >= MOCKS_FOR_READINESS &&
    recent.every((attempt) => attempt.score >= MOCK_PASS_SCORE);
  const chaptersOk = incompleteChapters.length === 0;
  const isReady = mocksOk && chaptersOk;
  const percent = readinessPercentFor(chapters, completed, isReady);

  if (completed.length < MOCKS_FOR_READINESS) {
    return { status: 'not-enough-data', mocksCompleted: completed.length, percent };
  }

  if (isReady) {
    return { status: 'ready', keepPracticing: [], percent: 100 };
  }

  const reasons: ReadinessReason[] = [];
  if (failedRecent) {
    reasons.push({ id: 'mock' });
  }
  for (const chapter of incompleteChapters) {
    if (chapter.total < CHAPTER_ANSWER_FLOOR) {
      reasons.push({
        id: 'chapter-thin',
        chapterId: chapter.id,
        total: chapter.total,
        need: CHAPTER_ANSWER_FLOOR,
      });
    } else {
      reasons.push({
        id: 'chapter',
        chapterId: chapter.id,
        rate: Math.round(chapter.rate * 100),
        total: chapter.total,
      });
    }
  }

  return { status: 'not-ready', reasons, keepPracticing, weakChapters, percent };
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
  const chaptersTouched = stats.chapters.filter((chapter) => chapter.total > 0).length;
  const hasChapterDepth = stats.chapters.some(
    (chapter) => chapter.total >= CHAPTER_ANSWER_FLOOR,
  );
  const studyReady =
    mocksCompleted > 0 ||
    stats.seenQuestions >= MOCK_SEEN_FLOOR ||
    chaptersTouched >= MOCK_CHAPTER_FLOOR ||
    hasChapterDepth;

  if (stats.seenQuestions === 0 && !stats.flashcardsStarted) {
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

  // Build study habits before pushing timed mocks (one daily answer used to skip here).
  if (mocksCompleted < MOCKS_FOR_READINESS && !studyReady) {
    return {
      kind: 'session',
      title: 'Today’s session',
      blurb:
        'Eight due cards and eight questions from your weakest chapter, then stop. Better prep than jumping into a full mock.',
      cta: 'Start today’s session',
      altCta: stats.cardsDue > 0 ? 'Review flashcards' : 'Practice quiz',
      chapterId: null,
    };
  }

  if (mocksCompleted < MOCKS_FOR_READINESS) {
    return {
      kind: 'mock',
      title: mocksCompleted === 0 ? 'Sit your first mock exam' : `Sit mock exam #${mocksCompleted + 1}`,
      blurb: `20 questions, 45 minutes, ${MOCK_PASS_SCORE} to pass — the same shape as the real test. Readiness needs ${MOCKS_FOR_READINESS} passed mocks and strong chapter scores.`,
      cta: 'Start mock exam',
      altCta: 'Today’s session instead',
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
    flashcardsStarted: Object.keys(progress.flashcardState).length > 0,
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
