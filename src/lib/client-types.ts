import type { ChapterId, RegionCode } from '../content/schema';

export type ClientOption = {
  id: string;
  text: string;
};

export type ClientQuestion = {
  id: string;
  chapter: ChapterId;
  region: RegionCode | null;
  type: 'mcq' | 'true_false';
  prompt: string;
  options: ClientOption[];
  correctOptionId: string;
  explanation: string;
  source: string;
};

export type ClientCard = {
  id: string;
  chapter: ChapterId;
  front: string;
  back: string;
  source: string;
};

export type ChapterOption = {
  id: ChapterId;
  title: string;
};
