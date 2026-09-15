import type { ChapterId } from '../content/schema';

const EN_BASE =
  'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/discover-canada/read-online';
const FR_BASE =
  'https://www.canada.ca/fr/immigration-refugies-citoyennete/organisation/publications-guides/decouvrir-canada/lisez-ligne';

/* Canada.ca's own slug for the first chapter is misspelled; keep it verbatim. */
const SLUGS: Record<ChapterId, { en: string; fr: string }> = {
  'rights-and-responsibilities': {
    en: 'rights-resonsibilities-citizenship.html',
    fr: 'droits-responsabilites-citoyennete.html',
  },
  'who-we-are': { en: 'who-are-canadians.html', fr: 'qui-sont-canadiens.html' },
  'canadas-history': { en: 'canadas-history.html', fr: 'histoire-canada.html' },
  'modern-canada': { en: 'modern-canada.html', fr: 'canada-moderne.html' },
  'how-canadians-govern-themselves': {
    en: 'how-canadians-govern-themselves.html',
    fr: 'canadiens-systeme-gouvernement.html',
  },
  'federal-elections': { en: 'federal-elections.html', fr: 'elections-federales.html' },
  'the-justice-system': { en: 'justice-system.html', fr: 'systeme-justice.html' },
  'canadian-symbols': { en: 'canadian-symbols.html', fr: 'symboles-canadiens.html' },
  'canadas-economy': { en: 'canadas-economy.html', fr: 'economie-canada.html' },
  'canadas-regions': { en: 'canadas-regions.html', fr: 'regions-canada.html' },
};

export function officialChapterUrl(chapter: ChapterId, locale: 'en' | 'fr'): string {
  const slug = SLUGS[chapter];
  return locale === 'fr' ? `${FR_BASE}/${slug.fr}` : `${EN_BASE}/${slug.en}`;
}
