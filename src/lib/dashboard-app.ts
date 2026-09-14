import { dashboardStats, percent, type DashboardStats } from './dashboard-stats';
import { loadProgress } from './progress';
import { localizedChapterTitle, t, type Locale } from './i18n';
import type { ChapterId } from '../content/schema';

type Paths = {
  chapters: string;
  practice: string;
  flashcards: string;
  mock: string;
};

type NextStep = {
  title: string;
  blurb: string;
  cta: string;
  href: string;
  altCta: string;
  altHref: string;
};

export function dashboardApp() {
  return {
    stats: null as DashboardStats | null,
    totalQuestions: 0,
    totalCards: 0,
    paths: { chapters: '/', practice: '/', flashcards: '/', mock: '/' } as Paths,
    percent,

    tx(key: string, vars?: Record<string, string | number>) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return t(key, locale, vars);
    },

    chapterName(id: ChapterId) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return localizedChapterTitle(id, locale);
    },

    init() {
      const data = (this as unknown as { $el: HTMLElement }).$el.dataset;
      this.totalQuestions = Number(data.totalQuestions ?? 0);
      this.totalCards = Number(data.totalCards ?? 0);
      this.paths = {
        chapters: data.chaptersPath ?? '/',
        practice: data.practicePath ?? '/',
        flashcards: data.flashcardsPath ?? '/',
        mock: data.mockPath ?? '/',
      };
      this.refresh();
    },

    refresh() {
      this.stats = dashboardStats(loadProgress().progress, this.totalCards);
    },

    get seenLabel(): string {
      if (!this.stats) {
        return '';
      }
      return this.totalQuestions
        ? this.tx('dash.ofQuestions', { total: this.totalQuestions })
        : this.tx('dash.unique');
    },

    get dialValue(): number {
      if (!this.stats || this.stats.overallTotal === 0) {
        return 0;
      }
      return Math.round(this.stats.overallRate * 100);
    },

    get readinessSummary(): { label: string; note: string } {
      if (!this.stats) {
        return { label: '', note: '' };
      }
      const readiness = this.stats.readiness;
      if (readiness.status === 'not-enough-data') {
        const left = 3 - readiness.mocksCompleted;
        return {
          label: this.stats.seenQuestions === 0 ? this.tx('dash.notStarted') : this.tx('dash.gettingStarted'),
          note: this.tx(left === 1 ? 'dash.unlock' : 'dash.unlocks', { n: left }),
        };
      }
      if (readiness.status === 'ready') {
        return {
          label: this.tx('dash.testReady'),
          note: this.tx('dash.readyNote'),
        };
      }
      const n = readiness.reasons.length;
      return {
        label: this.tx('dash.notReady'),
        note: n === 1 ? this.tx('dash.fixOne') : this.tx('dash.fixMany', { n }),
      };
    },

    reasonText(reason: { id: string; chapterId?: ChapterId; rate?: number; total?: number }) {
      if (reason.id === 'mock') {
        return this.tx('reason.mock');
      }
      return this.tx('reason.chapter', {
        chapter: this.chapterName(reason.chapterId as ChapterId),
        rate: reason.rate ?? 0,
        total: reason.total ?? 0,
      });
    },

    get nextStep(): NextStep | null {
      if (!this.stats) {
        return null;
      }
      const { recommendation } = this.stats;
      const chapter = recommendation.chapterId;
      const withChapter = (base: string) =>
        chapter ? `${base}?chapter=${chapter}` : base;

      const targets: Record<string, [string, string]> = {
        read: [
          chapter ? `${this.paths.chapters}${chapter}/` : this.paths.chapters,
          this.paths.practice,
        ],
        mock: [this.paths.mock, this.paths.practice],
        drill: [withChapter(this.paths.practice), withChapter(this.paths.flashcards)],
        cards: [this.paths.flashcards, this.paths.practice],
        maintain: [this.paths.practice, this.paths.mock],
      };

      const [href, altHref] = targets[recommendation.kind] ?? [
        this.paths.practice,
        this.paths.mock,
      ];

      const chapterTitle = chapter ? this.chapterName(chapter) : '';
      const copy = {
        read: {
          title: this.tx('rec.read.title'),
          blurb: this.tx('rec.read.blurb'),
          cta: this.tx('rec.read.cta'),
          altCta: this.tx('rec.read.alt'),
        },
        mock: {
          title:
            this.stats.mockTrend.length === 0
              ? this.tx('rec.mock.first')
              : this.tx('rec.mock.next', { n: this.stats.mockTrend.length + 1 }),
          blurb: this.tx('rec.mock.blurb'),
          cta: this.tx('rec.mock.cta'),
          altCta: this.tx('rec.mock.alt'),
        },
        drill: {
          title: this.tx('rec.drill.title', { chapter: chapterTitle }),
          blurb: this.tx('rec.drill.blurb', {
            rate: percent(this.stats.chapters.find((item) => item.id === chapter)?.rate ?? 0),
            total: this.stats.chapters.find((item) => item.id === chapter)?.total ?? 0,
          }),
          cta: this.tx('rec.drill.cta'),
          altCta: this.tx('rec.drill.alt'),
        },
        cards: {
          title:
            this.stats.cardsDue === 1
              ? this.tx('rec.cards.one')
              : this.tx('rec.cards.many', { n: this.stats.cardsDue }),
          blurb: this.tx('rec.cards.blurb'),
          cta: this.tx('rec.cards.cta'),
          altCta: this.tx('rec.cards.alt'),
        },
        maintain: {
          title: this.tx('rec.maintain.title'),
          blurb: this.tx('rec.maintain.blurb'),
          cta: this.tx('rec.maintain.cta'),
          altCta: this.tx('rec.maintain.alt'),
        },
      }[recommendation.kind];

      return {
        title: copy?.title ?? recommendation.title,
        blurb: copy?.blurb ?? recommendation.blurb,
        cta: copy?.cta ?? recommendation.cta,
        href,
        altCta: copy?.altCta ?? recommendation.altCta,
        altHref,
      };
    },
  };
}
