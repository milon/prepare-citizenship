export type AppLocale = 'en' | 'fr';

const FR_PREFIX = '/fr';

/** Site-asset and base-path helper (no locale prefix). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${suffix}`;
}

export function localeFromPathname(pathname: string): AppLocale {
  const bare = stripBase(pathname);
  if (bare === '/fr' || bare === '/fr/' || bare.startsWith('/fr/')) {
    return 'fr';
  }
  return 'en';
}

/** Pathname without Astro `base`, always starting with `/`. */
export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL || '/';
  if (base !== '/' && pathname.startsWith(base)) {
    const rest = pathname.slice(base.endsWith('/') ? base.length - 1 : base.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

/** Drop `/fr` prefix; result always starts with `/`. */
export function stripLocalePrefix(pathname: string): string {
  const bare = stripBase(pathname);
  if (bare === '/fr' || bare === '/fr/') {
    return '/';
  }
  if (bare.startsWith('/fr/')) {
    const rest = bare.slice(FR_PREFIX.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return bare;
}

/**
 * App route for a locale. `path` is a root-relative app path, optionally with
 * `?query` and `#hash` (e.g. `/chapters/foo/`, `/glossary/#oath`).
 */
export function localeHref(path: string, locale: AppLocale): string {
  const match = path.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const pathname = match?.[1] || '/';
  const search = match?.[2] || '';
  const hash = match?.[3] || '';

  let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  // Avoid double-prefixing.
  if (normalized === '/fr' || normalized === '/fr/' || normalized.startsWith('/fr/')) {
    normalized = stripLocalePrefix(normalized);
  }

  const withLocale =
    locale === 'fr'
      ? normalized === '/'
        ? `${FR_PREFIX}/`
        : `${FR_PREFIX}${normalized}`
      : normalized;

  return `${withBase(withLocale)}${search}${hash}`;
}

/** Switch an absolute-or-root path between en and fr, preserving query/hash. */
export function swapLocalePath(pathnameWithSearch: string, locale: AppLocale): string {
  try {
    const url = new URL(pathnameWithSearch, 'https://preparecitizenship.ca');
    const unprefixed = stripLocalePrefix(url.pathname);
    const next = localeHref(`${unprefixed}${url.search}${url.hash}`, locale);
    return next;
  } catch {
    return localeHref(pathnameWithSearch, locale);
  }
}

export function isHomePath(pathname: string): boolean {
  const bare = stripLocalePrefix(pathname).replace(/\/+$/, '') || '/';
  return bare === '/';
}
