import type { SearchDoc } from './search';
import { searchDocs } from './search';
import { pickLocalized, t, type Locale } from './i18n';

export function searchApp(docs: SearchDoc[]) {
  return {
    query: '',
    get hits() {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return searchDocs(docs, this.query, locale);
    },
    tx(key: string, vars?: Record<string, string | number>) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return t(key, locale, vars);
    },
    pick(value: { en: string; fr: string | null }) {
      const locale = ((this as { $store?: { i18n?: { locale: Locale } } }).$store?.i18n
        ?.locale ?? 'en') as Locale;
      return pickLocalized(value, locale);
    },
  };
}
