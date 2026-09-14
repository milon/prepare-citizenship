import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import eco from './qbank/eco.mjs';
import ele from './qbank/ele.mjs';
import gov from './qbank/gov.mjs';
import his from './qbank/his.mjs';
import jus from './qbank/jus.mjs';
import mod from './qbank/mod.mjs';
import reg from './qbank/reg.mjs';
import rnr from './qbank/rnr.mjs';
import sym from './qbank/sym.mjs';
import wwa from './qbank/wwa.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = {
  'rights-and-responsibilities': rnr,
  'who-we-are': wwa,
  'canadas-history': his,
  'modern-canada': mod,
  'how-canadians-govern-themselves': gov,
  'federal-elections': ele,
  'the-justice-system': jus,
  'canadian-symbols': sym,
  'canadas-economy': eco,
  'canadas-regions': reg,
};

let total = 0;
let regional = 0;
let tf = 0;

for (const [chapter, questions] of Object.entries(files)) {
  const ids = new Set();
  for (const question of questions) {
    if (ids.has(question.id)) {
      throw new Error(`Duplicate id ${question.id} in ${chapter}`);
    }
    ids.add(question.id);
    total += 1;
    if (question.region) regional += 1;
    if (question.type === 'true_false') tf += 1;
  }
  const path = join(root, 'src/content/questions', `${chapter}.json`);
  await writeFile(path, `${JSON.stringify(questions, null, 2)}\n`);
  console.log(`${chapter}: ${questions.length}`);
}

console.log(`Total ${total} (${tf} true/false, ${regional} regional)`);
