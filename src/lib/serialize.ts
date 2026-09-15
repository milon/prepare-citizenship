import type { CollectionEntry } from 'astro:content';
import { interpolateCurrent } from './interpolate';
import type { ClientCard, ClientQuestion } from './client-types';
import type { CurrentFacts } from '../content/schema';
import type { LocalizedText } from './i18n';
import { localizedSource } from './i18n';

function loc(
  en: string,
  fr: string | null | undefined,
  current: CurrentFacts,
  region: ClientQuestion['region'],
): LocalizedText {
  const currentFr: CurrentFacts = {
    ...current,
    headOfState: current.headOfState.replace(/^King /, 'roi '),
    partyInPower:
      current.partyInPower === 'Liberal Party of Canada'
        ? 'Parti libéral du Canada'
        : current.partyInPower,
  };
  return {
    en: interpolateCurrent(en, current, { region, locale: 'en' }),
    fr: fr ? interpolateCurrent(fr, currentFr, { region, locale: 'fr' }) : null,
  };
}

export function toClientQuestion(
  question: CollectionEntry<'questions'>['data'],
  current: CurrentFacts,
): ClientQuestion {
  return {
    id: question.id,
    chapter: question.chapter,
    region: question.region,
    type: question.type,
    prompt: loc(question.prompt.en, question.prompt.fr, current, question.region),
    options: question.options.map((option) => ({
      id: option.id,
      text: loc(option.en, option.fr, current, question.region),
    })),
    correctOptionId: question.correctOptionId,
    explanation: loc(question.explanation.en, question.explanation.fr, current, question.region),
    source: {
      en: question.source,
      fr: localizedSource(question.chapter, 'fr'),
    },
  };
}

export function cardFromQuestion(question: ClientQuestion): ClientCard {
  const answerEn =
    question.options.find((option) => option.id === question.correctOptionId)?.text.en ?? '';
  const answerFr =
    question.options.find((option) => option.id === question.correctOptionId)?.text.fr ?? '';
  return {
    id: question.id,
    chapter: question.chapter,
    region: question.region,
    front: question.prompt,
    back: {
      en: `${answerEn}\n\n${question.explanation.en}`,
      fr: question.prompt.fr
        ? `${answerFr || answerEn}\n\n${question.explanation.fr ?? question.explanation.en}`
        : null,
    },
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
    front: loc(card.front.en, card.front.fr, current, null),
    back: loc(card.back.en, card.back.fr, current, null),
    source: {
      en: card.source,
      fr: localizedSource(card.chapter, 'fr'),
    },
  };
}
