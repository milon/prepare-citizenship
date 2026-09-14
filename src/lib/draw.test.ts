import { describe, expect, it } from 'vitest';
import { CHAPTER_IDS, type ChapterId } from '../content/schema';
import type { ClientQuestion } from './client-types';
import { drawMockQuestions } from './draw';

function question(chapter: ChapterId, index: number): ClientQuestion {
  const type = index % 2 === 0 ? 'mcq' : 'true_false';
  const optionIds = type === 'mcq' ? ['a', 'b', 'c', 'd'] : ['true', 'false'];
  return {
    id: `${chapter}-${index}`,
    chapter,
    region: chapter === 'canadas-regions' && index % 2 === 0 ? 'on' : null,
    type,
    prompt: { en: `Question ${index}`, fr: `Question ${index}` },
    options: optionIds.map((id) => ({
      id,
      text: { en: id, fr: id },
    })),
    correctOptionId: optionIds[0],
    explanation: { en: 'Explanation', fr: 'Explication' },
    source: { en: 'Source', fr: 'Source' },
  };
}

const bank = CHAPTER_IDS.flatMap((chapter) =>
  Array.from({ length: 6 }, (_, index) => question(chapter, index)),
);

describe('drawMockQuestions', () => {
  it('creates a reproducible, balanced 20-question paper', () => {
    const first = drawMockQuestions(bank, 'on', { seed: 'paper-1' });
    const second = drawMockQuestions(bank, 'on', { seed: 'paper-1' });

    expect(first).toEqual(second);
    expect(first).toHaveLength(20);
    for (const chapter of CHAPTER_IDS) {
      expect(first.filter((item) => item.chapter === chapter)).toHaveLength(2);
    }
    expect(first.some((item) => item.region === 'on')).toBe(true);
  });

  it('avoids all previously used questions until a chapter needs recycling', () => {
    const avoidedIds = new Set(
      CHAPTER_IDS.flatMap((chapter) =>
        Array.from({ length: 4 }, (_, index) => `${chapter}-${index}`),
      ),
    );
    const paper = drawMockQuestions(bank, 'on', { avoidedIds, seed: 'fresh-paper' });

    expect(paper.every((item) => !avoidedIds.has(item.id))).toBe(true);
  });

  it('prioritizes missed questions inside the balanced chapter draw', () => {
    const preferredIds = new Set(CHAPTER_IDS.map((chapter) => `${chapter}-4`));
    const paper = drawMockQuestions(bank, 'on', { preferredIds, seed: 'missed-paper' });

    for (const preferredId of preferredIds) {
      expect(paper.some((item) => item.id === preferredId)).toBe(true);
    }
  });

  it('keeps true/false option order stable while randomizing MCQ choices', () => {
    const paper = drawMockQuestions(bank, 'on', { seed: 'option-paper' });
    const trueFalse = paper.filter((item) => item.type === 'true_false');

    expect(trueFalse.length).toBeGreaterThan(0);
    for (const item of trueFalse) {
      expect(item.options.map((option) => option.id)).toEqual(['true', 'false']);
    }
  });
});
