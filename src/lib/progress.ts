import type { ChapterId, RegionCode } from '../content/schema';
import { REGION_CODES } from '../content/schema';
import { todayStamp } from './dates';

export const PROGRESS_KEY = 'prepare-citizenship.progress.v1';

export type AttemptMode = 'practice' | 'mock';

export type AttemptAnswer = {
  questionId: string;
  chapter: ChapterId;
  selectedOptionId: string | null;
  correct: boolean;
};

export type QuizAttempt = {
  id: string;
  date: string;
  mode: AttemptMode;
  score: number;
  total: number;
  questionIds: string[];
  answers: AttemptAnswer[];
};

export type FlashcardRecord = {
  box: 1 | 2 | 3;
  due: string;
  lastSeen: string;
};

export type ProgressSettings = {
  persistAsked: boolean;
  theme: 'system' | 'light' | 'dark';
  fontSize: 'md' | 'lg' | 'xl';
};

export type Progress = {
  schemaVersion: 1;
  province: RegionCode | null;
  quizAttempts: QuizAttempt[];
  flashcardState: Record<string, FlashcardRecord>;
  missedQuestionIds: string[];
  settings: ProgressSettings;
};

export const emptyProgress = (): Progress => ({
  schemaVersion: 1,
  province: null,
  quizAttempts: [],
  flashcardState: {},
  missedQuestionIds: [],
  settings: { persistAsked: false, theme: 'system', fontSize: 'md' },
});

type StorageNotice = {
  available: boolean;
  saveFailed: boolean;
};

const storageListeners = new Set<(notice: StorageNotice) => void>();

export function subscribeStorage(listener: (notice: StorageNotice) => void): () => void {
  storageListeners.add(listener);
  return () => {
    storageListeners.delete(listener);
  };
}

function notifyStorage(notice: StorageNotice) {
  for (const listener of storageListeners) {
    listener(notice);
  }
}

function storageWritable(): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  try {
    const probe = `${PROGRESS_KEY}:probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function isRegionCode(value: unknown): value is RegionCode {
  return typeof value === 'string' && (REGION_CODES as readonly string[]).includes(value);
}

export function parseProgress(raw: unknown): Progress {
  const base = emptyProgress();
  if (raw === null || typeof raw !== 'object') {
    return base;
  }

  const data = raw as Partial<Progress>;
  if (data.schemaVersion !== 1) {
    return base;
  }

  return {
    schemaVersion: 1,
    province: isRegionCode(data.province) ? data.province : null,
    quizAttempts: Array.isArray(data.quizAttempts) ? data.quizAttempts : [],
    flashcardState:
      data.flashcardState && typeof data.flashcardState === 'object' ? data.flashcardState : {},
    missedQuestionIds: Array.isArray(data.missedQuestionIds) ? data.missedQuestionIds : [],
    settings: {
      persistAsked: Boolean(data.settings?.persistAsked),
      theme:
        data.settings?.theme === 'light' || data.settings?.theme === 'dark'
          ? data.settings.theme
          : 'system',
      fontSize:
        data.settings?.fontSize === 'lg' || data.settings?.fontSize === 'xl'
          ? data.settings.fontSize
          : 'md',
    },
  };
}

export function parseImportedProgress(
  raw: unknown,
): { ok: true; progress: Progress } | { ok: false; message: string } {
  if (raw === null || typeof raw !== 'object') {
    return { ok: false, message: 'That file is not a progress export from this app.' };
  }
  const data = raw as { schemaVersion?: unknown };
  if (data.schemaVersion !== 1) {
    return { ok: false, message: 'This app can only import schemaVersion 1 progress files.' };
  }
  return { ok: true, progress: parseProgress(raw) };
}

export type LoadResult = {
  progress: Progress;
  saveFailed: boolean;
  storageAvailable: boolean;
};

export function loadProgress(): LoadResult {
  if (!storageWritable()) {
    notifyStorage({ available: false, saveFailed: false });
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { progress: emptyProgress(), saveFailed: false, storageAvailable: false };
    }
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        return {
          progress: parseProgress(JSON.parse(raw)),
          saveFailed: false,
          storageAvailable: false,
        };
      }
    } catch {
      return { progress: emptyProgress(), saveFailed: false, storageAvailable: false };
    }
    return { progress: emptyProgress(), saveFailed: false, storageAvailable: false };
  }

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return { progress: emptyProgress(), saveFailed: false, storageAvailable: true };
    }
    return {
      progress: parseProgress(JSON.parse(raw)),
      saveFailed: false,
      storageAvailable: true,
    };
  } catch {
    notifyStorage({ available: false, saveFailed: false });
    return { progress: emptyProgress(), saveFailed: false, storageAvailable: false };
  }
}

export function saveProgress(progress: Progress): boolean {
  if (!storageWritable()) {
    notifyStorage({ available: false, saveFailed: true });
    return false;
  }

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    notifyStorage({ available: true, saveFailed: false });
    return true;
  } catch {
    notifyStorage({ available: false, saveFailed: true });
    return false;
  }
}

export function resetProgress(keepProvince: boolean): Progress {
  const current = loadProgress().progress;
  const next = emptyProgress();
  if (keepProvince) {
    next.province = current.province;
  }
  next.settings = { ...current.settings };
  saveProgress(next);
  return next;
}

export function recordAttempt(progress: Progress, attempt: QuizAttempt): Progress {
  const missed = new Set(progress.missedQuestionIds);
  for (const answer of attempt.answers) {
    if (answer.correct) {
      missed.delete(answer.questionId);
    } else {
      missed.add(answer.questionId);
    }
  }

  return {
    ...progress,
    quizAttempts: [...progress.quizAttempts, attempt],
    missedQuestionIds: [...missed],
  };
}

export function chapterAccuracy(
  progress: Progress,
): Record<ChapterId, { correct: number; total: number; rate: number }> {
  const stats = {} as Record<ChapterId, { correct: number; total: number; rate: number }>;

  for (const attempt of progress.quizAttempts) {
    for (const answer of attempt.answers) {
      const current = stats[answer.chapter] ?? { correct: 0, total: 0, rate: 0 };
      current.total += 1;
      if (answer.correct) {
        current.correct += 1;
      }
      current.rate = current.total === 0 ? 0 : current.correct / current.total;
      stats[answer.chapter] = current;
    }
  }

  return stats;
}

export function weakestChapter(progress: Progress): ChapterId | null {
  const stats = Object.entries(chapterAccuracy(progress)) as [
    ChapterId,
    { correct: number; total: number; rate: number },
  ][];
  const eligible = stats.filter(([, value]) => value.total >= 3);
  if (eligible.length === 0) {
    return null;
  }
  eligible.sort((a, b) => a[1].rate - b[1].rate || a[1].total - b[1].total);
  return eligible[0][0];
}

export function lastMockQuestionIds(progress: Progress, count = 3): Set<string> {
  const mocks = progress.quizAttempts.filter((attempt) => attempt.mode === 'mock').slice(-count);
  return new Set(mocks.flatMap((attempt) => attempt.questionIds));
}

export function newAttemptId(now = new Date()): string {
  return `${todayStamp(now)}-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
