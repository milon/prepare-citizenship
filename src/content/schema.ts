import { z } from 'astro/zod';

export const CHAPTER_IDS = [
  'rights-and-responsibilities',
  'who-we-are',
  'canadas-history',
  'modern-canada',
  'how-canadians-govern-themselves',
  'federal-elections',
  'the-justice-system',
  'canadian-symbols',
  'canadas-economy',
  'canadas-regions',
] as const;

export const REGION_CODES = [
  'ab',
  'bc',
  'mb',
  'nb',
  'nl',
  'ns',
  'nt',
  'nu',
  'on',
  'pe',
  'qc',
  'sk',
  'yt',
] as const;

export const CURRENT_FACT_KEYS = [
  'headOfState',
  'governorGeneral',
  'primeMinister',
  'speakerOfTheHouse',
  'partyInPower',
] as const;

export const REGIONAL_FACT_KEYS = [
  'premier',
  'crownRepresentative',
  'oppositionLeader',
  'governingParty',
] as const;

const localizedNameSchema = z.object({
  en: z.string().trim().min(1),
  fr: z.string().trim().min(1),
});

const personOrLocalizedSchema = z.union([z.string().trim().min(1), localizedNameSchema]);

export const regionalCurrentSchema = z.object({
  kind: z.enum(['province', 'territory']),
  ofName: localizedNameSchema,
  inName: localizedNameSchema,
  premier: z.string().trim().min(1),
  crownRepresentative: z.string().trim().min(1),
  oppositionLeader: personOrLocalizedSchema,
  governingParty: localizedNameSchema,
});

export const QUESTION_ID_PATTERN = /^[a-z]{3}-\d{3}$/;
export const FLASHCARD_ID_PATTERN = /^[a-z]{3}-\d{3}$/;

const localizedTextSchema = z.object({
  en: z.string().trim().min(1),
  fr: z.string().trim().min(1).nullable().optional(),
});

const optionSchema = z.object({
  id: z.string().trim().min(1),
  en: z.string().trim().min(1),
  fr: z.string().trim().min(1).nullable().optional(),
});

export const questionSchema = z
  .object({
    id: z.string().regex(QUESTION_ID_PATTERN, 'Use a prefix plus three digits, for example gov-014'),
    chapter: z.enum(CHAPTER_IDS),
    region: z.enum(REGION_CODES).nullable(),
    type: z.enum(['mcq', 'true_false']),
    difficulty: z.enum(['core', 'review']),
    prompt: localizedTextSchema,
    options: z.array(optionSchema),
    correctOptionId: z.string().trim().min(1),
    explanation: localizedTextSchema,
    source: z.string().trim().min(1),
    currentFactKey: z.enum(CURRENT_FACT_KEYS).optional(),
  })
  .superRefine((question, ctx) => {
    const optionIds = question.options.map((option) => option.id);

    if (new Set(optionIds).size !== optionIds.length) {
      ctx.addIssue({
        code: 'custom',
        message: `Question ${question.id} has duplicate option ids`,
        path: ['options'],
      });
    }

    if (question.type === 'mcq' && question.options.length !== 4) {
      ctx.addIssue({
        code: 'custom',
        message: `MCQ ${question.id} must have exactly 4 options`,
        path: ['options'],
      });
    }

    if (question.type === 'true_false') {
      const sortedIds = [...optionIds].sort();
      if (question.options.length !== 2 || sortedIds[0] !== 'false' || sortedIds[1] !== 'true') {
        ctx.addIssue({
          code: 'custom',
          message: `True/false ${question.id} must use two options with ids "true" and "false"`,
          path: ['options'],
        });
      }
    }

    if (!optionIds.includes(question.correctOptionId)) {
      ctx.addIssue({
        code: 'custom',
        message: `Question ${question.id} correctOptionId "${question.correctOptionId}" is not in options`,
        path: ['correctOptionId'],
      });
    }

    if (question.currentFactKey) {
      const haystack = [
        question.prompt.en,
        question.prompt.fr ?? '',
        question.explanation.en,
        question.explanation.fr ?? '',
        ...question.options.flatMap((option) => [option.en, option.fr ?? '']),
      ].join('\n');
      const token = `{{${question.currentFactKey}}}`;
      if (!haystack.includes(token)) {
        ctx.addIssue({
          code: 'custom',
          message: `Question ${question.id} sets currentFactKey but never uses ${token}`,
          path: ['currentFactKey'],
        });
      }
    }
  });

export const extraFlashcardSchema = z.object({
  id: z.string().regex(FLASHCARD_ID_PATTERN, 'Use a prefix plus three digits, for example sym-003'),
  chapter: z.enum(CHAPTER_IDS),
  front: localizedTextSchema,
  back: localizedTextSchema,
  source: z.string().trim().min(1),
});

export const currentFactsSchema = z
  .object({
    lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use ISO date YYYY-MM-DD'),
    headOfState: z.string().trim().min(1),
    governorGeneral: z.string().trim().min(1),
    primeMinister: z.string().trim().min(1),
    speakerOfTheHouse: z.string().trim().min(1),
    partyInPower: z.string().trim().min(1),
    regions: z.record(z.enum(REGION_CODES), regionalCurrentSchema),
  })
  .superRefine((current, ctx) => {
    for (const code of REGION_CODES) {
      if (!current.regions[code]) {
        ctx.addIssue({
          code: 'custom',
          message: `Missing regional current facts for ${code}`,
          path: ['regions', code],
        });
      }
    }
  });

export const chapterSummarySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  order: z.number().int().positive(),
  chapter: z.enum(CHAPTER_IDS),
  regionGroup: z
    .enum(['atlantic', 'central', 'prairie', 'west-coast', 'northern'])
    .optional(),
});

export type ChapterId = (typeof CHAPTER_IDS)[number];
export type RegionCode = (typeof REGION_CODES)[number];
export type CurrentFactKey = (typeof CURRENT_FACT_KEYS)[number];
export type RegionalFactKey = (typeof REGIONAL_FACT_KEYS)[number];
export type Question = z.infer<typeof questionSchema>;
export type ExtraFlashcard = z.infer<typeof extraFlashcardSchema>;
export type CurrentFacts = z.infer<typeof currentFactsSchema>;
export type RegionalCurrent = z.infer<typeof regionalCurrentSchema>;
