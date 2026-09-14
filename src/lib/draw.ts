import { CHAPTER_IDS, type ChapterId, type RegionCode } from '../content/schema';
import type { ClientQuestion } from './client-types';
import { shuffle } from './shuffle';

const MOCK_SIZE = 20;

function eligibleForProvince(
  questions: ClientQuestion[],
  province: RegionCode,
): ClientQuestion[] {
  return questions.filter((question) => question.region === null || question.region === province);
}

function takeFromChapter(
  pool: ClientQuestion[],
  chapter: ChapterId,
  count: number,
  preferRegional: boolean,
  province: RegionCode,
): ClientQuestion[] {
  const chapterPool = shuffle(pool.filter((question) => question.chapter === chapter));
  if (chapterPool.length === 0 || count <= 0) {
    return [];
  }

  if (preferRegional) {
    const regional = chapterPool.filter((question) => question.region === province);
    const national = chapterPool.filter((question) => question.region === null);
    const picked: ClientQuestion[] = [];
    if (regional.length > 0) {
      picked.push(regional[0]);
    }
    for (const question of [...national, ...regional]) {
      if (picked.length >= count) {
        break;
      }
      if (!picked.includes(question)) {
        picked.push(question);
      }
    }
    return picked.slice(0, count);
  }

  const trueFalse = chapterPool.filter((question) => question.type === 'true_false');
  const mcq = chapterPool.filter((question) => question.type === 'mcq');
  const picked: ClientQuestion[] = [];
  if (count >= 2 && trueFalse.length > 0 && mcq.length > 0) {
    picked.push(trueFalse[0], mcq[0]);
    return picked.slice(0, count);
  }
  return chapterPool.slice(0, count);
}

function fill(picked: ClientQuestion[], pool: ClientQuestion[], needed: number): ClientQuestion[] {
  const have = new Set(picked.map((question) => question.id));
  const extras = shuffle(pool.filter((question) => !have.has(question.id)));
  return [...picked, ...extras.slice(0, Math.max(0, needed - picked.length))];
}

export function drawMockQuestions(
  questions: ClientQuestion[],
  province: RegionCode,
  recentIds: Set<string>,
): ClientQuestion[] {
  const eligible = eligibleForProvince(questions, province);
  const fresh = eligible.filter((question) => !recentIds.has(question.id));
  const pools = fresh.length >= MOCK_SIZE ? [fresh, eligible] : [eligible];

  for (const pool of pools) {
    let picked: ClientQuestion[] = [];
    for (const chapter of CHAPTER_IDS) {
      picked = [
        ...picked,
        ...takeFromChapter(pool, chapter, 2, chapter === 'canadas-regions', province),
      ];
    }
    picked = fill(picked, pool, MOCK_SIZE);
    if (picked.length >= MOCK_SIZE) {
      return shuffle(picked.slice(0, MOCK_SIZE)).map((question) => ({
        ...question,
        options: shuffle(question.options),
      }));
    }
  }

  return shuffle(eligible)
    .slice(0, MOCK_SIZE)
    .map((question) => ({
      ...question,
      options: shuffle(question.options),
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
