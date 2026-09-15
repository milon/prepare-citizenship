import type {
  CurrentFactKey,
  CurrentFacts,
  RegionalCurrent,
  RegionalFactKey,
  RegionCode,
} from '../content/schema';
import { CURRENT_FACT_KEYS, REGIONAL_FACT_KEYS } from '../content/schema';

export type InterpolateLocale = 'en' | 'fr';

function localizedValue(
  value: string | { en: string; fr: string },
  locale: InterpolateLocale,
): string {
  if (typeof value === 'string') {
    return value;
  }
  return locale === 'fr' ? value.fr : value.en;
}

export function regionalTokens(
  region: RegionalCurrent,
  locale: InterpolateLocale = 'en',
): Record<RegionalFactKey, string> {
  return {
    premier: region.premier,
    crownRepresentative: region.crownRepresentative,
    oppositionLeader: localizedValue(region.oppositionLeader, locale),
    governingParty: localizedValue(region.governingParty, locale),
  };
}

export function interpolateCurrent(
  text: string,
  current: CurrentFacts,
  options: { region?: RegionCode | null; locale?: InterpolateLocale } = {},
): string {
  const locale = options.locale ?? 'en';
  const regional =
    options.region && current.regions[options.region]
      ? regionalTokens(current.regions[options.region], locale)
      : null;

  return text.replace(/\{\{(\w+)\}\}/g, (token, key: string) => {
    if (regional && (REGIONAL_FACT_KEYS as readonly string[]).includes(key)) {
      return regional[key as RegionalFactKey];
    }
    if ((CURRENT_FACT_KEYS as readonly string[]).includes(key)) {
      return current[key as CurrentFactKey];
    }
    return token;
  });
}
