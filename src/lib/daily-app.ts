import type { ClientQuestion } from './client-types';
import { pickDailyQuestion } from './daily-question';
import { msUntilNextLocalMidnight, todayStamp } from './dates';
import { pickLocalized, toggleSpeak, canUseSpeech, t, type Locale, type LocalizedText } from './i18n';
import {
  loadProgress,
  newAttemptId,
  recordAttempt,
  saveProgress,
  type Progress,
} from './progress';

export type DailyPayload = {
  questions: ClientQuestion[];
};

export function dailyQuestionApp(payload: DailyPayload) {
  return {
    question: null as ClientQuestion | null,
    selected: null as string | null,
    revealed: false,
    saveFailed: false,
    chaptersBase: '/',

    tx(key: string, vars?: Record<string, string | number>) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return t(key, locale, vars);
    },

    pick(value: LocalizedText | string) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return pickLocalized(value, locale);
    },

    get chapterHref(): string {
      if (!this.question) {
        return this.chaptersBase;
      }
      return `${this.chaptersBase}${this.question.chapter}/`;
    },

    get doneNote(): string {
      const ms = msUntilNextLocalMidnight();
      const totalMinutes = Math.floor(ms / 60_000);
      if (totalMinutes < 1) {
        return this.tx('daily.doneSoon');
      }
      if (totalMinutes < 60) {
        return this.tx(totalMinutes === 1 ? 'daily.doneMinute' : 'daily.doneMinutes', {
          n: totalMinutes,
        });
      }
      const hours = Math.floor(totalMinutes / 60);
      return this.tx(hours === 1 ? 'daily.doneHour' : 'daily.doneHours', { n: hours });
    },

    init() {
      const data = (this as unknown as { $el: HTMLElement }).$el.dataset;
      this.chaptersBase = data.chaptersBase ?? '/chapters/';
      const loaded = loadProgress();
      const today = todayStamp();
      const picked = pickDailyQuestion(payload.questions, loaded.progress, today);
      this.question = picked;
      if (!picked) {
        return;
      }

      const saved = loaded.progress.dailyQuestion;
      if (saved?.date === today && saved.questionId === picked.id && saved.selectedOptionId) {
        this.selected = saved.selectedOptionId;
        this.revealed = true;
        return;
      }

      if (saved?.date !== today || saved.questionId !== picked.id) {
        this.persist({
          ...loaded.progress,
          dailyQuestion: { date: today, questionId: picked.id },
        });
      }
    },

    persist(progress: Progress) {
      this.saveFailed = !saveProgress(progress);
    },

    optionState(optionId: string): string {
      if (!this.revealed || !this.question) {
        return '';
      }
      if (optionId === this.question.correctOptionId) {
        return 'correct';
      }
      if (optionId === this.selected) {
        return 'incorrect';
      }
      return '';
    },

    choose(optionId: string) {
      if (this.revealed || !this.question) {
        return;
      }
      this.selected = optionId;
      this.revealed = true;

      const loaded = loadProgress();
      const today = todayStamp();
      const alreadySaved =
        loaded.progress.dailyQuestion?.date === today &&
        loaded.progress.dailyQuestion.questionId === this.question.id &&
        Boolean(loaded.progress.dailyQuestion.selectedOptionId);
      if (alreadySaved) {
        return;
      }

      const correct = optionId === this.question.correctOptionId;
      const next = recordAttempt(loaded.progress, {
        id: newAttemptId(),
        date: new Date().toISOString(),
        mode: 'practice',
        score: correct ? 1 : 0,
        total: 1,
        questionIds: [this.question.id],
        answers: [
          {
            questionId: this.question.id,
            chapter: this.question.chapter,
            selectedOptionId: optionId,
            correct,
          },
        ],
      });
      next.dailyQuestion = {
        date: today,
        questionId: this.question.id,
        selectedOptionId: optionId,
      };
      this.persist(next);
    },

    onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('select, input, textarea, summary')) {
        return;
      }
      if (this.revealed) {
        return;
      }
      if (event.key >= '1' && event.key <= '4') {
        const option = this.question?.options[Number(event.key) - 1];
        if (option) {
          event.preventDefault();
          this.choose(option.id);
        }
      }
    },

    canSpeak() {
      return canUseSpeech();
    },

    speakId() {
      return this.question ? `daily:${this.question.id}` : '';
    },

    speakPrompt() {
      if (!this.question) {
        return;
      }
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      toggleSpeak(this.pick(this.question.prompt), locale, this.speakId());
    },
  };
}
