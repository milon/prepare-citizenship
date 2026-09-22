import { describe, expect, it } from 'vitest';
import {
  isHomePath,
  localeFromPathname,
  localeHref,
  stripLocalePrefix,
  swapLocalePath,
} from './paths';

describe('locale paths', () => {
  it('detects locale from pathname', () => {
    expect(localeFromPathname('/')).toBe('en');
    expect(localeFromPathname('/chapters/')).toBe('en');
    expect(localeFromPathname('/fr/')).toBe('fr');
    expect(localeFromPathname('/fr/chapters/foo/')).toBe('fr');
  });

  it('strips locale prefix', () => {
    expect(stripLocalePrefix('/fr/')).toBe('/');
    expect(stripLocalePrefix('/fr/faq/')).toBe('/faq/');
    expect(stripLocalePrefix('/chapters/')).toBe('/chapters/');
  });

  it('builds locale hrefs', () => {
    expect(localeHref('/', 'en')).toBe('/');
    expect(localeHref('/', 'fr')).toBe('/fr/');
    expect(localeHref('/chapters/', 'fr')).toBe('/fr/chapters/');
    expect(localeHref('/glossary/#oath', 'fr')).toBe('/fr/glossary/#oath');
    expect(localeHref('/practice/?chapter=rights', 'fr')).toBe('/fr/practice/?chapter=rights');
    expect(localeHref('/fr/faq/', 'en')).toBe('/faq/');
  });

  it('swaps locale and recognizes home', () => {
    expect(swapLocalePath('/settings/', 'fr')).toBe('/fr/settings/');
    expect(swapLocalePath('/fr/settings/', 'en')).toBe('/settings/');
    expect(isHomePath('/')).toBe(true);
    expect(isHomePath('/fr/')).toBe(true);
    expect(isHomePath('/fr/faq/')).toBe(false);
  });
});
