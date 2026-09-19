import { describe, expect, it } from 'vitest';
import {
  CHAPTER_ANSWER_FLOOR,
  MOCK_PASS_SCORE,
  MOCK_SEEN_FLOOR,
  MOCKS_FOR_READINESS,
  recommendationFor,
  readinessFor,
  type ChapterStat,
  type DashboardStats,
} from './dashboard-stats';
import { CHAPTERS } from './chapters';
import { emptyProgress, type Progress, type QuizAttempt } from './progress';
import type { ChapterId } from '../content/schema';

function baseStats(
  overrides: Partial<Omit<DashboardStats, 'recommendation'>> = {},
): Omit<DashboardStats, 'recommendation'> {
  const chapters: ChapterStat[] = CHAPTERS.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    correct: 0,
    total: 0,
    rate: 0,
    status: 'keep-practicing',
  }));
  return {
    overallCorrect: 0,
    overallTotal: 0,
    overallRate: 0,
    streak: 0,
    seenQuestions: 0,
    cardsDue: 0,
    flashcardsStarted: false,
    mocksPassed: 0,
    mockTrend: [],
    chapters,
    readiness: { status: 'not-enough-data', mocksCompleted: 0, percent: 0 },
    ...overrides,
  };
}

function attempt(
  mode: 'practice' | 'mock',
  score: number,
  total: number,
  answers: QuizAttempt['answers'] = [],
): QuizAttempt {
  return {
    id: `a-${Math.random().toString(36).slice(2)}`,
    date: '2026-01-01T12:00:00.000Z',
    mode,
    score,
    total,
    questionIds: answers.map((answer) => answer.questionId),
    answers,
  };
}

function chapterAnswers(
  chapterId: ChapterId,
  correct: number,
  total: number,
): QuizAttempt['answers'] {
  return Array.from({ length: total }, (_, index) => ({
    questionId: `${chapterId}-${index}`,
    chapter: chapterId,
    selectedOptionId: 'a',
    correct: index < correct,
  }));
}

function onTrackProgress(): Progress {
  const progress = emptyProgress();
  for (const chapter of CHAPTERS) {
    progress.quizAttempts.push(
      attempt(
        'practice',
        8,
        CHAPTER_ANSWER_FLOOR,
        chapterAnswers(chapter.id, 8, CHAPTER_ANSWER_FLOOR),
      ),
    );
  }
  for (let i = 0; i < MOCKS_FOR_READINESS; i += 1) {
    progress.quizAttempts.push(attempt('mock', MOCK_PASS_SCORE, 20));
  }
  return progress;
}

describe('recommendationFor', () => {
  it('starts brand-new learners on chapter one', () => {
    expect(recommendationFor(baseStats()).kind).toBe('read');
  });

  it('prefers today’s session after a single quiz answer, not a mock', () => {
    const rec = recommendationFor(
      baseStats({
        seenQuestions: 1,
        overallTotal: 1,
        overallCorrect: 1,
        overallRate: 1,
      }),
    );
    expect(rec.kind).toBe('session');
  });

  it('prefers session when flashcards have started with no quiz answers yet', () => {
    expect(recommendationFor(baseStats({ flashcardsStarted: true })).kind).toBe('session');
  });

  it('pushes a mock after enough study breadth', () => {
    const chapters = baseStats().chapters.map((chapter, index) =>
      index < 2
        ? { ...chapter, total: 5, correct: 4, rate: 0.8, status: 'keep-practicing' as const }
        : chapter,
    );
    const rec = recommendationFor(
      baseStats({
        seenQuestions: 10,
        overallTotal: 10,
        overallCorrect: 8,
        overallRate: 0.8,
        chapters,
      }),
    );
    expect(rec.kind).toBe('mock');
  });

  it('pushes a mock after the seen-question floor', () => {
    const rec = recommendationFor(
      baseStats({
        seenQuestions: MOCK_SEEN_FLOOR,
        overallTotal: MOCK_SEEN_FLOOR,
        overallCorrect: 18,
        overallRate: 18 / MOCK_SEEN_FLOOR,
      }),
    );
    expect(rec.kind).toBe('mock');
  });

  it('pushes a mock after one chapter reaches the answer floor', () => {
    const chapters = baseStats().chapters.map((chapter, index) =>
      index === 0
        ? {
            ...chapter,
            total: CHAPTER_ANSWER_FLOOR,
            correct: 8,
            rate: 0.8,
            status: 'on-track' as const,
          }
        : chapter,
    );
    expect(
      recommendationFor(
        baseStats({
          seenQuestions: CHAPTER_ANSWER_FLOOR,
          overallTotal: CHAPTER_ANSWER_FLOOR,
          overallCorrect: 8,
          overallRate: 0.8,
          chapters,
        }),
      ).kind,
    ).toBe('mock');
  });

  it('keeps recommending mocks until three are done once study-ready', () => {
    const rec = recommendationFor(
      baseStats({
        seenQuestions: MOCK_SEEN_FLOOR,
        mockTrend: [{ date: '2026-01-01', score: 16, total: 20, passed: true }],
        mocksPassed: 1,
        readiness: { status: 'not-enough-data', mocksCompleted: 1, percent: 6 },
      }),
    );
    expect(rec.kind).toBe('mock');
  });
});

describe('readinessFor', () => {
  it('stays near zero after a single correct daily answer', () => {
    const progress = emptyProgress();
    progress.quizAttempts.push(
      attempt('practice', 1, 1, chapterAnswers(CHAPTERS[0].id, 1, 1)),
    );
    const readiness = readinessFor(progress);
    expect(readiness.status).toBe('not-enough-data');
    expect(readiness.percent).toBeLessThan(5);
  });

  it('never reports 100% while mocks or chapters are incomplete', () => {
    const progress = emptyProgress();
    for (const chapter of CHAPTERS) {
      progress.quizAttempts.push(
        attempt(
          'practice',
          8,
          CHAPTER_ANSWER_FLOOR,
          chapterAnswers(chapter.id, 8, CHAPTER_ANSWER_FLOOR),
        ),
      );
    }
    const readiness = readinessFor(progress);
    expect(readiness.status).toBe('not-enough-data');
    expect(readiness.percent).toBeLessThan(100);
  });

  it('blocks ready when a chapter is untouched even after three passed mocks', () => {
    const progress = emptyProgress();
    for (const chapter of CHAPTERS.slice(0, -1)) {
      progress.quizAttempts.push(
        attempt(
          'practice',
          8,
          CHAPTER_ANSWER_FLOOR,
          chapterAnswers(chapter.id, 8, CHAPTER_ANSWER_FLOOR),
        ),
      );
    }
    for (let i = 0; i < MOCKS_FOR_READINESS; i += 1) {
      progress.quizAttempts.push(attempt('mock', MOCK_PASS_SCORE, 20));
    }
    const readiness = readinessFor(progress);
    expect(readiness.status).toBe('not-ready');
    expect(readiness.percent).toBeLessThan(100);
    if (readiness.status === 'not-ready') {
      expect(readiness.reasons.some((reason) => reason.id === 'chapter-thin')).toBe(true);
    }
  });

  it('is ready at 100% only with every chapter on-track and three passed mocks', () => {
    const readiness = readinessFor(onTrackProgress());
    expect(readiness).toEqual({
      status: 'ready',
      keepPracticing: [],
      percent: 100,
    });
  });

  it('drops below ready when a recent mock fails', () => {
    const progress = onTrackProgress();
    progress.quizAttempts.push(attempt('mock', MOCK_PASS_SCORE - 1, 20));
    const readiness = readinessFor(progress);
    expect(readiness.status).toBe('not-ready');
    expect(readiness.percent).toBeLessThan(100);
    if (readiness.status === 'not-ready') {
      expect(readiness.reasons.some((reason) => reason.id === 'mock')).toBe(true);
    }
  });
});
