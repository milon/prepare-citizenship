export const DISPLAY_NAME_MAX = 40;

export function parseDisplayName(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, DISPLAY_NAME_MAX);
}

export function possessiveName(name: string): string {
  if (!name) {
    return '';
  }
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

export function nameFileSlug(name: string): string {
  return parseDisplayName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
