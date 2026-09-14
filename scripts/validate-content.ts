import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CHAPTER_IDS,
  currentFactsSchema,
  extraFlashcardSchema,
  questionSchema,
  type ChapterId,
  type ExtraFlashcard,
  type Question,
} from '../src/content/schema.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors: string[] = [];

async function readJson(relativePath: string): Promise<unknown> {
  const raw = await readFile(join(root, relativePath), 'utf8');
  return JSON.parse(raw);
}

async function readJsonArray(relativeDir: string): Promise<{ fileName: string; items: unknown[] }[]> {
  const dir = join(root, relativeDir);
  const files = (await readdir(dir)).filter((name) => name.endsWith('.json')).sort();
  const bundles: { fileName: string; items: unknown[] }[] = [];

  for (const fileName of files) {
    const parsed = await readJson(join(relativeDir, fileName));
    if (!Array.isArray(parsed)) {
      errors.push(`${relativeDir}/${fileName} must be a JSON array`);
      continue;
    }
    bundles.push({ fileName, items: parsed });
  }

  return bundles;
}

function reportZodError(label: string, issuePath: PropertyKey[], message: string) {
  const path = issuePath.length > 0 ? issuePath.map(String).join('.') : '(root)';
  errors.push(`${label} ${path}: ${message}`);
}

const questionBundles = await readJsonArray('src/content/questions');
const questions: Question[] = [];
const questionIds = new Map<string, string>();

for (const bundle of questionBundles) {
  const expectedChapter = bundle.fileName.replace(/\.json$/, '') as ChapterId;
  if (!CHAPTER_IDS.includes(expectedChapter)) {
    errors.push(`Question file ${bundle.fileName} does not match an allowed chapter id`);
  }

  for (const [index, item] of bundle.items.entries()) {
    const parsed = questionSchema.safeParse(item);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        reportZodError(`${bundle.fileName}[${index}]`, issue.path, issue.message);
      }
      continue;
    }

    const question = parsed.data;
    if (question.chapter !== expectedChapter) {
      errors.push(
        `${bundle.fileName}[${index}] chapter is "${question.chapter}" but the file is for "${expectedChapter}"`,
      );
    }

    const previousFile = questionIds.get(question.id);
    if (previousFile) {
      errors.push(`Duplicate question id ${question.id} in ${previousFile} and ${bundle.fileName}`);
    } else {
      questionIds.set(question.id, bundle.fileName);
    }

    questions.push(question);
  }
}

const flashcardBundles = await readJsonArray('src/content/flashcards');
const flashcards: ExtraFlashcard[] = [];
const flashcardIds = new Map<string, string>();

for (const bundle of flashcardBundles) {
  for (const [index, item] of bundle.items.entries()) {
    const parsed = extraFlashcardSchema.safeParse(item);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        reportZodError(`${bundle.fileName}[${index}]`, issue.path, issue.message);
      }
      continue;
    }

    const card = parsed.data;
    const previousQuestion = questionIds.get(card.id);
    if (previousQuestion) {
      errors.push(`Flashcard id ${card.id} collides with question id in ${previousQuestion}`);
    }

    const previousCard = flashcardIds.get(card.id);
    if (previousCard) {
      errors.push(`Duplicate flashcard id ${card.id} in ${previousCard} and ${bundle.fileName}`);
    } else {
      flashcardIds.set(card.id, bundle.fileName);
    }

    flashcards.push(card);
  }
}

const currentParsed = currentFactsSchema.safeParse(await readJson('src/content/current.json'));
if (!currentParsed.success) {
  for (const issue of currentParsed.error.issues) {
    reportZodError('current.json', issue.path, issue.message);
  }
}

if (questions.length < 30) {
  errors.push(`Expected at least 30 gold-standard questions, found ${questions.length}`);
}

const types = questions.reduce(
  (counts, question) => {
    counts[question.type] += 1;
    return counts;
  },
  { mcq: 0, true_false: 0 },
);

if (types.true_false < 1) {
  errors.push('Gold-standard set must include at least one true/false question');
}

if (!questions.some((question) => question.region !== null)) {
  errors.push('Gold-standard set must include at least one regional question');
}

if (errors.length > 0) {
  console.error('Content validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${questions.length} questions (${types.mcq} MCQ, ${types.true_false} true/false) and ${flashcards.length} extra flashcards.`,
);
if (currentParsed.success) {
  console.log(`current.json last verified ${currentParsed.data.lastVerified}.`);
}
