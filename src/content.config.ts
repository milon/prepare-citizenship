import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { jsonArrayLoader } from './content/loaders';
import {
  chapterSummarySchema,
  currentFactsSchema,
  extraFlashcardSchema,
  questionSchema,
} from './content/schema';

const questions = defineCollection({
  loader: jsonArrayLoader('src/content/questions'),
  schema: questionSchema,
});

const extraFlashcards = defineCollection({
  loader: jsonArrayLoader('src/content/flashcards'),
  schema: extraFlashcardSchema,
});

const current = defineCollection({
  loader: file('src/content/current.json', {
    parser: (text) => {
      const data = JSON.parse(text) as Record<string, unknown>;
      return [{ id: 'current', ...data }];
    },
  }),
  schema: currentFactsSchema,
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: chapterSummarySchema,
});

export const collections = {
  questions,
  extraFlashcards,
  current,
  chapters,
};
