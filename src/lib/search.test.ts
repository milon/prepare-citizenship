import { describe, expect, it } from 'vitest';
import { plainFromMarkdown, searchDocs, type SearchDoc } from './search';
import { dueSessionCards, formatClock } from './session-app';
import type { ClientCard } from './client-types';
import type { Progress } from './progress';

const docs: SearchDoc[] = [
  {
    kind: 'chapter',
    id: 'federal-elections',
    href: '/chapters/federal-elections/',
    chapter: 'federal-elections',
    title: { en: 'Federal Elections', fr: 'Les élections fédérales' },
    body: { en: 'Each riding elects one MP.', fr: 'Chaque circonscription élit un député.' },
  },
  {
    kind: 'question',
    id: 'ele-001',
    href: '/practice/?chapter=federal-elections',
    chapter: 'federal-elections',
    title: { en: 'What is a riding?', fr: 'Qu’est-ce qu’une circonscription?' },
    body: { en: 'An electoral district.', fr: 'Une circonscription électorale.' },
  },
];

describe('plainFromMarkdown', () => {
  it('strips links and headings', () => {
    expect(plainFromMarkdown('# Title\n\nSee the [Charter](/glossary/#charter).')).toContain('Charter');
    expect(plainFromMarkdown('# Title\n\nSee the [Charter](/glossary/#charter).')).not.toContain('/glossary');
  });
});

describe('searchDocs', () => {
  it('finds a chapter by title and a question by prompt', () => {
    const riding = searchDocs(docs, 'riding', 'en');
    expect(riding.some((hit) => hit.id === 'federal-elections')).toBe(true);
    expect(riding.some((hit) => hit.id === 'ele-001')).toBe(true);
  });

  it('uses French text when the locale is French', () => {
    const hits = searchDocs(docs, 'circonscription', 'fr');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title.fr).toBeTruthy();
  });

  it('ignores one-letter queries', () => {
    expect(searchDocs(docs, 'r', 'en')).toEqual([]);
  });
});

describe('session helpers', () => {
  it('formats the countdown clock', () => {
    expect(formatClock(15 * 60)).toBe('15:00');
    expect(formatClock(65)).toBe('01:05');
  });

  it('takes only due cards, capped at N', () => {
    const cards = [
      { id: 'a', chapter: 'federal-elections', front: { en: 'A', fr: 'A' }, back: { en: 'A', fr: 'A' }, source: { en: 's', fr: 's' } },
      { id: 'b', chapter: 'federal-elections', front: { en: 'B', fr: 'B' }, back: { en: 'B', fr: 'B' }, source: { en: 's', fr: 's' } },
    ] as ClientCard[];
    const progress = {
      flashcardState: {
        a: { box: 1, due: '2099-01-01', lastSeen: '2026-01-01' },
      },
    } as unknown as Progress;
    const due = dueSessionCards(cards, progress, 8);
    expect(due.map((card) => card.id)).toEqual(['b']);
  });
});
