import { CHAPTER_IDS, type ChapterId, type RegionCode } from '../content/schema';
import type { ClientQuestion } from './client-types';
import { seededRandom, shuffle, type RandomSource } from './shuffle';

const MOCK_SIZE = 20;

export function eligibleForProvince<T extends { region?: RegionCode | null }>(
  items: T[],
  province: RegionCode,
): T[] {
  return items.filter((item) => item.region == null || item.region === province);
}

function preferQuestions(
  questions: ClientQuestion[],
  preferredIds: Set<string>,
  random: RandomSource,
): ClientQuestion[] {
  const randomized = shuffle(questions, random);
  return [
    ...randomized.filter((question) => preferredIds.has(question.id)),
    ...randomized.filter((question) => !preferredIds.has(question.id)),
  ];
}

function chapterCandidates(
  eligible: ClientQuestion[],
  chapter: ChapterId,
  avoidedIds: Set<string>,
  preferredIds: Set<string>,
  random: RandomSource,
): ClientQuestion[] {
  const chapterPool = eligible.filter((question) => question.chapter === chapter);
  const fresh = chapterPool.filter((question) => !avoidedIds.has(question.id));
  const recycled = chapterPool.filter((question) => avoidedIds.has(question.id));
  return [
    ...preferQuestions(fresh, preferredIds, random),
    ...preferQuestions(recycled, preferredIds, random),
  ];
}

function takeTwoFromChapter(
  candidates: ClientQuestion[],
  chapter: ChapterId,
  province: RegionCode,
): ClientQuestion[] {
  if (candidates.length <= 2) {
    return candidates;
  }

  if (chapter === 'canadas-regions') {
    const regional = candidates.find((question) => question.region === province);
    if (regional) {
      return [regional, candidates.find((question) => question.id !== regional.id)!];
    }
  }

  const first = candidates[0];
  const otherType = candidates.find((question) => question.type !== first.type);
  return [first, otherType ?? candidates[1]];
}

export type MockDrawOptions = {
  avoidedIds?: Set<string>;
  preferredIds?: Set<string>;
  seed?: string;
};

export function drawMockQuestions(
  questions: ClientQuestion[],
  province: RegionCode,
  options: MockDrawOptions = {},
): ClientQuestion[] {
  const eligible = eligibleForProvince(questions, province);
  const avoidedIds = options.avoidedIds ?? new Set<string>();
  const preferredIds = options.preferredIds ?? new Set<string>();
  const random = options.seed ? seededRandom(options.seed) : Math.random;
  let picked: ClientQuestion[] = [];

  for (const chapter of CHAPTER_IDS) {
    const candidates = chapterCandidates(
      eligible,
      chapter,
      avoidedIds,
      preferredIds,
      random,
    );
    picked = [...picked, ...takeTwoFromChapter(candidates, chapter, province)];
  }

  if (picked.length < MOCK_SIZE) {
    const selected = new Set(picked.map((question) => question.id));
    const extras = preferQuestions(
      eligible.filter((question) => !selected.has(question.id)),
      preferredIds,
      random,
    );
    picked = [...picked, ...extras.slice(0, MOCK_SIZE - picked.length)];
  }

  return shuffle(picked.slice(0, MOCK_SIZE), random)
    .map((question) => ({
      ...question,
      // True/false choices stay in their authored order; randomizing them adds noise.
      options:
        question.type === 'true_false' ? [...question.options] : shuffle(question.options, random),
    }));
}

export function shufflePractice(questions: ClientQuestion[], count: number): ClientQuestion[] {
  return shuffle(questions)
    .slice(0, count)
    .map((question) => ({
      ...question,
      options: shuffle(question.options),
    }));
}
