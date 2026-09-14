import { getCollection } from 'astro:content';
import { CHAPTERS } from './chapters';
import type { ChapterId } from '../content/schema';
import { cardFromQuestion, toClientCard, toClientQuestion } from './serialize';
import type { ClientCard, ClientQuestion } from './client-types';

export async function loadStudyContent() {
  const [questionEntries, cardEntries, currentEntries] = await Promise.all([
    getCollection('questions'),
    getCollection('extraFlashcards'),
    getCollection('current'),
  ]);
  const current = currentEntries[0].data;
  const questions: ClientQuestion[] = questionEntries.map((entry) =>
    toClientQuestion(entry.data, current),
  );
  const extraCards: ClientCard[] = cardEntries.map((entry) => toClientCard(entry.data, current));
  const questionCards = questions.map(cardFromQuestion);
  const extraIds = new Set(extraCards.map((card) => card.id));
  const cards = [...questionCards.filter((card) => !extraIds.has(card.id)), ...extraCards];
  const chapters = CHAPTERS.map((chapter) => ({ id: chapter.id, title: chapter.title }));
  return { questions, cards, chapters, current };
}

export function parseChapterParam(value: string | null): ChapterId | 'all' | 'weakest' {
  if (value === 'weakest' || value === 'all') {
    return value;
  }
  if (value && CHAPTERS.some((chapter) => chapter.id === value)) {
    return value as ChapterId;
  }
  return 'all';
}
