import type { ChapterId, RegionCode } from '../content/schema';
import type { LocalizedText } from './i18n';

export type ClientOption = {
  id: string;
  text: LocalizedText;
};

export type ClientQuestion = {
  id: string;
  chapter: ChapterId;
  region: RegionCode | null;
  type: 'mcq' | 'true_false';
  prompt: LocalizedText;
  options: ClientOption[];
  correctOptionId: string;
  explanation: LocalizedText;
  source: LocalizedText;
};

export type ClientCard = {
  id: string;
  chapter: ChapterId;
  region?: RegionCode | null;
  front: LocalizedText;
  back: LocalizedText;
  source: LocalizedText;
};

export type ChapterOption = {
  id: ChapterId;
  title: LocalizedText;
};
