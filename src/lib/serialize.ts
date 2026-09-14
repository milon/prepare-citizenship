import type { CollectionEntry } from 'astro:content';
import { interpolateCurrent } from './interpolate';
import type { ClientCard, ClientQuestion } from './client-types';
import type { CurrentFacts } from '../content/schema';

export function toClientQuestion(
  question: CollectionEntry<'questions'>['data'],
  current: CurrentFacts,
): ClientQuestion {
  return {
    id: question.id,
    chapter: question.chapter,
    region: question.region,
    type: question.type,
    prompt: interpolateCurrent(question.prompt.en, current),
    options: question.options.map((option) => ({
      id: option.id,
      text: interpolateCurrent(option.en, current),
    })),
    correctOptionId: question.correctOptionId,
    explanation: interpolateCurrent(question.explanation.en, current),
    source: question.source,
  };
}

export function cardFromQuestion(question: ClientQuestion): ClientCard {
  const answer =
    question.options.find((option) => option.id === question.correctOptionId)?.text ?? '';
  return {
    id: question.id,
    chapter: question.chapter,
    front: question.prompt,
    back: `${answer}\n\n${question.explanation}`,
    source: question.source,
  };
}

export function toClientCard(
  card: CollectionEntry<'extraFlashcards'>['data'],
  current: CurrentFacts,
): ClientCard {
  return {
    id: card.id,
    chapter: card.chapter,
    front: interpolateCurrent(card.front.en, current),
    back: interpolateCurrent(card.back.en, current),
    source: card.source,
  };
}
