import type { ChapterId, RegionCode } from '../content/schema';

export const CHAPTERS: {
  id: ChapterId;
  title: string;
  sourceHeading: string;
}[] = [
  {
    id: 'rights-and-responsibilities',
    title: 'Rights and Responsibilities',
    sourceHeading: 'Rights and Responsibilities of Citizenship',
  },
  {
    id: 'who-we-are',
    title: 'Who We Are',
    sourceHeading: 'Who We Are',
  },
  {
    id: 'canadas-history',
    title: "Canada's History",
    sourceHeading: "Canada's History",
  },
  {
    id: 'modern-canada',
    title: 'Modern Canada',
    sourceHeading: 'Modern Canada',
  },
  {
    id: 'how-canadians-govern-themselves',
    title: 'How Canadians Govern Themselves',
    sourceHeading: 'How Canadians Govern Themselves',
  },
  {
    id: 'federal-elections',
    title: 'Federal Elections',
    sourceHeading: 'Federal Elections',
  },
  {
    id: 'the-justice-system',
    title: 'The Justice System',
    sourceHeading: 'The Justice System',
  },
  {
    id: 'canadian-symbols',
    title: 'Canadian Symbols',
    sourceHeading: 'Canadian Symbols',
  },
  {
    id: 'canadas-economy',
    title: "Canada's Economy",
    sourceHeading: "Canada's Economy",
  },
  {
    id: 'canadas-regions',
    title: "Canada's Regions",
    sourceHeading: "Canada's Regions",
  },
];

export const REGION_LABELS: Record<RegionCode, string> = {
  ab: 'Alberta',
  bc: 'British Columbia',
  mb: 'Manitoba',
  nb: 'New Brunswick',
  nl: 'Newfoundland and Labrador',
  ns: 'Nova Scotia',
  nt: 'Northwest Territories',
  nu: 'Nunavut',
  on: 'Ontario',
  pe: 'Prince Edward Island',
  qc: 'Quebec',
  sk: 'Saskatchewan',
  yt: 'Yukon',
};

export function chapterTitle(id: ChapterId): string {
  const match = CHAPTERS.find((chapter) => chapter.id === id);
  if (!match) {
    throw new Error(`Unknown chapter: ${id}`);
  }
  return match.title;
}

export function discoverCanadaSource(id: ChapterId): string {
  const match = CHAPTERS.find((chapter) => chapter.id === id);
  if (!match) {
    throw new Error(`Unknown chapter: ${id}`);
  }
  return `Discover Canada — ${match.sourceHeading}`;
}
