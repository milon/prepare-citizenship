import type { ChapterId } from '../content/schema';
import type { LocalizedText } from './i18n';
import { pickLocalized, type Locale } from './i18n';

export type SearchDoc = {
  kind: 'chapter' | 'question';
  id: string;
  href: string;
  chapter: ChapterId;
  title: LocalizedText;
  body: LocalizedText;
};

export type SearchHit = SearchDoc & {
  snippet: string;
};

export function plainFromMarkdown(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

function snippetAround(text: string, query: string): string {
  const lower = text.toLowerCase();
  const at = lower.indexOf(query.toLowerCase());
  if (at < 0) {
    return text.slice(0, 160).trim();
  }
  const start = Math.max(0, at - 48);
  const end = Math.min(text.length, at + query.length + 96);
  const chunk = text.slice(start, end).trim();
  return `${start > 0 ? '…' : ''}${chunk}${end < text.length ? '…' : ''}`;
}

export function searchDocs(docs: SearchDoc[], query: string, locale: Locale, limit = 30): SearchHit[] {
  const needle = query.trim();
  if (needle.length < 2) {
    return [];
  }
  const key = normalize(needle);
  const scored: Array<SearchHit & { score: number }> = [];

  for (const doc of docs) {
    const title = pickLocalized(doc.title, locale);
    const body = pickLocalized(doc.body, locale);
    const titleKey = normalize(title);
    const bodyKey = normalize(body);
    let score = 0;
    if (titleKey === key) {
      score = 100;
    } else if (titleKey.startsWith(key)) {
      score = 80;
    } else if (titleKey.includes(key)) {
      score = 60;
    } else if (bodyKey.includes(key)) {
      score = 30;
    }
    if (score === 0) {
      continue;
    }
    if (doc.kind === 'chapter') {
      score += 4;
    }
    scored.push({
      ...doc,
      snippet: snippetAround(body || title, needle),
      score,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.title.en.localeCompare(b.title.en));
  return scored.slice(0, limit);
}
