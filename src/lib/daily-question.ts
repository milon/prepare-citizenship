import type { ClientQuestion } from './client-types';
import { eligibleForProvince } from './draw';
import { todayStamp } from './dates';
import type { Progress } from './progress';
import { seededRandom, shuffle } from './shuffle';

export function dailyQuestionPool(
  questions: ClientQuestion[],
  progress: Progress,
): ClientQuestion[] {
  if (progress.province) {
    return eligibleForProvince(questions, progress.province);
  }
  return questions.filter((question) => question.region == null);
}

export function pickDailyQuestion(
  questions: ClientQuestion[],
  progress: Progress,
  today = todayStamp(),
): ClientQuestion | null {
  const pool = dailyQuestionPool(questions, progress);
  if (pool.length === 0) {
    return null;
  }

  const saved = progress.dailyQuestion;
  if (saved?.date === today) {
    const kept = pool.find((question) => question.id === saved.questionId);
    if (kept) {
      return kept;
    }
  }

  const seenIds = new Set(progress.quizAttempts.flatMap((attempt) => attempt.questionIds));
  const missedIds = new Set(progress.missedQuestionIds);
  const unseen = pool.filter((question) => !seenIds.has(question.id));
  const missed = pool.filter((question) => missedIds.has(question.id));
  let candidates = unseen.length > 0 ? unseen : missed.length > 0 ? missed : pool;

  const previousId = saved?.questionId;
  if (previousId && candidates.length > 1) {
    candidates = candidates.filter((question) => question.id !== previousId);
  }

  const seed = `daily:${today}:${progress.province ?? 'none'}`;
  return shuffle(candidates, seededRandom(seed))[0] ?? null;
}
