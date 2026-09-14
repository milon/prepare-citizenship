import { dashboardStats, percent, type DashboardStats } from './dashboard-stats';
import { loadProgress } from './progress';

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
        ? `of ${this.totalQuestions}`
        : 'unique questions answered';
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
          label: this.stats.seenQuestions === 0 ? 'Not started' : 'Getting started',
          note: `Finish ${left} more mock${left === 1 ? '' : 's'} to unlock a readiness call.`,
        };
      }
      if (readiness.status === 'ready') {
        return {
          label: 'Test ready',
          note: 'Last three mocks passed and practiced chapters are at 70% or better.',
        };
      }
      return {
        label: 'Not ready yet',
        note: `${readiness.reasons.length} thing${readiness.reasons.length === 1 ? '' : 's'} to fix before the test.`,
      };
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

      return {
        title: recommendation.title,
        blurb: recommendation.blurb,
        cta: recommendation.cta,
        href,
        altCta: recommendation.altCta,
        altHref,
      };
    },
  };
}
