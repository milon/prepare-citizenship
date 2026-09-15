import { describe, expect, it } from 'vitest';
import {
  CHAPTER_ANSWER_FLOOR,
  MOCK_SEEN_FLOOR,
  recommendationFor,
  type ChapterStat,
  type DashboardStats,
} from './dashboard-stats';
import { CHAPTERS } from './chapters';

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
    readiness: { status: 'not-enough-data', mocksCompleted: 0 },
    ...overrides,
  };
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
        readiness: { status: 'not-enough-data', mocksCompleted: 1 },
      }),
    );
    expect(rec.kind).toBe('mock');
  });
});
