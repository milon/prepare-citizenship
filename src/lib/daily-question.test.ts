import { describe, expect, it } from 'vitest';
import type { ClientQuestion } from './client-types';
import { pickDailyQuestion } from './daily-question';
import { emptyProgress, type Progress } from './progress';
import type { ChapterId } from '../content/schema';

function question(
  id: string,
  region: ClientQuestion['region'] = null,
  chapter: ChapterId = 'who-we-are',
): ClientQuestion {
  return {
    id,
    chapter,
    region,
    type: 'true_false',
    prompt: { en: id, fr: id },
    options: [
      { id: 'true', text: { en: 'True', fr: 'Vrai' } },
      { id: 'false', text: { en: 'False', fr: 'Faux' } },
    ],
    correctOptionId: 'true',
    explanation: { en: 'Why', fr: 'Pourquoi' },
    source: { en: 'Source', fr: 'Source' },
  };
}

const bank = [
  question('a'),
  question('b'),
  question('c'),
  question('on-only', 'on', 'canadas-regions'),
  question('bc-only', 'bc', 'canadas-regions'),
];

function withProgress(overrides: Partial<Progress> = {}): Progress {
  return { ...emptyProgress(), ...overrides };
}

describe('pickDailyQuestion', () => {
  it('returns the same question for the same day and progress', () => {
    const progress = withProgress({ province: 'on' });
    const first = pickDailyQuestion(bank, progress, '2026-09-15');
    const second = pickDailyQuestion(bank, progress, '2026-09-15');
    expect(first?.id).toBe(second?.id);
    expect(first).not.toBeNull();
  });

  it('keeps a question already saved for today', () => {
    const progress = withProgress({
      province: 'on',
      dailyQuestion: { date: '2026-09-15', questionId: 'c' },
    });
    expect(pickDailyQuestion(bank, progress, '2026-09-15')?.id).toBe('c');
  });

  it('prefers unseen questions', () => {
    const progress = withProgress({
      province: 'on',
      quizAttempts: [
        {
          id: '1',
          date: '2026-09-01T00:00:00.000Z',
          mode: 'practice',
          score: 2,
          total: 2,
          questionIds: ['a', 'b', 'on-only'],
          answers: [],
        },
      ],
    });
    expect(pickDailyQuestion(bank, progress, '2026-09-15')?.id).toBe('c');
  });

  it('skips yesterday’s question when recycling the pool', () => {
    const progress = withProgress({
      province: 'on',
      quizAttempts: [
        {
          id: '1',
          date: '2026-09-01T00:00:00.000Z',
          mode: 'practice',
          score: 3,
          total: 3,
          questionIds: ['a', 'b', 'c', 'on-only'],
          answers: [],
        },
      ],
      dailyQuestion: { date: '2026-09-14', questionId: 'a' },
    });
    const picked = pickDailyQuestion(bank, progress, '2026-09-15');
    expect(picked?.id).not.toBe('a');
    expect(['b', 'c', 'on-only']).toContain(picked?.id);
  });

  it('drops regional questions for other provinces', () => {
    const progress = withProgress({ province: 'on' });
    const picked = pickDailyQuestion(bank, progress, '2026-09-15');
    expect(picked?.id).not.toBe('bc-only');
  });

  it('uses only general questions before a province is chosen', () => {
    const progress = withProgress();
    const picked = pickDailyQuestion(bank, progress, '2026-09-15');
    expect(picked?.region).toBeNull();
  });
});
