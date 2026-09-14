import { addDays, isDue, todayStamp } from './dates';
import type { FlashcardRecord, Progress } from './progress';

export type Box = 1 | 2 | 3;

export function defaultCardState(): FlashcardRecord {
  return { box: 1, due: todayStamp(), lastSeen: todayStamp() };
}

export function markCorrect(state: FlashcardRecord | undefined): FlashcardRecord {
  const today = todayStamp();
  const current = state ?? defaultCardState();
  if (current.box === 1) {
    return { box: 2, due: addDays(today, 3), lastSeen: today };
  }
  if (current.box === 2) {
    return { box: 3, due: addDays(today, 7), lastSeen: today };
  }
  return { box: 3, due: addDays(today, 7), lastSeen: today };
}

export function markLearning(state: FlashcardRecord | undefined): FlashcardRecord {
  const today = todayStamp();
  return { box: 1, due: today, lastSeen: today, ...(state ? {} : {}) };
}

export function markKnown(): FlashcardRecord {
  const today = todayStamp();
  return { box: 3, due: addDays(today, 7), lastSeen: today };
}

export function isCardDue(progress: Progress, cardId: string): boolean {
  const state = progress.flashcardState[cardId];
  if (!state) {
    return true;
  }
  return isDue(state.due);
}

export function boxLabel(box: Box): string {
  if (box === 1) {
    return 'Learning';
  }
  if (box === 2) {
    return 'Reviewing';
  }
  return 'Known';
}
