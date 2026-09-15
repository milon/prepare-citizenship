import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const REGION_CODES = [
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
];

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const current = JSON.parse(readFileSync(join(root, 'src/content/current.json'), 'utf8'));

function localized(value, locale = 'en') {
  if (typeof value === 'string') return value;
  return value[locale];
}

function pickDistractors(values, correct, count = 3) {
  const unique = [...new Set(values.filter((value) => value && value !== correct))];
  const selected = [];
  for (const value of unique) {
    if (selected.length >= count) break;
    selected.push(value);
  }
  const fillers = [
    'Not applicable',
    'Appointed by city council',
    'The Senate Speaker',
    'A municipal mayor',
  ];
  let i = 0;
  while (selected.length < count) {
    const filler = fillers[i % fillers.length];
    i += 1;
    if (filler !== correct && !selected.includes(filler)) {
      selected.push(filler);
    }
  }
  return selected.slice(0, count);
}

const codes = [...REGION_CODES];
const allPremiers = codes.map((code) => current.regions[code].premier);
const allCrown = codes.map((code) => current.regions[code].crownRepresentative);
const allOpposition = codes.map((code) => localized(current.regions[code].oppositionLeader, 'en'));
const allOppositionFr = codes.map((code) => localized(current.regions[code].oppositionLeader, 'fr'));
const allParties = codes.map((code) => localized(current.regions[code].governingParty, 'en'));
const allPartiesFr = codes.map((code) => localized(current.regions[code].governingParty, 'fr'));

let nextId = 76;
const rows = [];

for (const code of codes) {
  const region = current.regions[code];
  const ofEn = region.ofName.en;
  const ofFr = region.ofName.fr;
  const inEn = region.inName.en;
  const inFr = region.inName.fr;
  const isTerritory = region.kind === 'territory';
  const crownEn = isTerritory ? 'Commissioner' : 'Lieutenant Governor';
  const crownFr = isTerritory ? 'commissaire' : 'lieutenant-gouverneur';
  const consensus = isTerritory && localized(region.oppositionLeader, 'en').startsWith('None');

  const premierWrong = pickDistractors(allPremiers, region.premier);
  const crownWrong = pickDistractors(allCrown, region.crownRepresentative);
  const oppositionCorrect = localized(region.oppositionLeader, 'en');
  const oppositionWrong = pickDistractors(allOpposition, oppositionCorrect);
  const oppositionWrongFr = oppositionWrong.map((en) => {
    const index = allOpposition.indexOf(en);
    return index >= 0 ? allOppositionFr[index] : en;
  });
  const partyCorrect = localized(region.governingParty, 'en');
  const partyWrong = pickDistractors(allParties, partyCorrect);
  const partyWrongFr = partyWrong.map((en) => {
    const index = allParties.indexOf(en);
    return index >= 0 ? allPartiesFr[index] : en;
  });

  rows.push(
    {
      id: `reg-${String(nextId++).padStart(3, '0')}`,
      region: code,
      p: `Who is the Premier of ${ofEn}?`,
      pf: `Qui est le premier ministre ${ofFr}?`,
      o: ['{{premier}}', ...premierWrong],
      of: ['{{premier}}', ...premierWrong],
      a: 'a',
      e: `Sitting officials change. As of the last verification date in this app, the Premier is {{premier}}.`,
      ef: `Les titulaires changent. À la dernière date de vérification dans cette application, le premier ministre est {{premier}}.`,
    },
    {
      id: `reg-${String(nextId++).padStart(3, '0')}`,
      region: code,
      p: `Who is the ${crownEn} of ${ofEn}?`,
      pf: `Qui est le ${crownFr} ${ofFr}?`,
      o: ['{{crownRepresentative}}', ...crownWrong],
      of: ['{{crownRepresentative}}', ...crownWrong],
      a: 'a',
      e: isTerritory
        ? `Territories have a commissioner rather than a lieutenant governor. As of the last verification date, the Commissioner is {{crownRepresentative}}.`
        : `Each province has a Lieutenant Governor representing the Crown. As of the last verification date, it is {{crownRepresentative}}.`,
      ef: isTerritory
        ? `Les territoires ont un commissaire plutôt qu’un lieutenant-gouverneur. À la dernière date de vérification, le commissaire est {{crownRepresentative}}.`
        : `Chaque province a un lieutenant-gouverneur qui représente la Couronne. À la dernière date de vérification, c’est {{crownRepresentative}}.`,
    },
    {
      id: `reg-${String(nextId++).padStart(3, '0')}`,
      region: code,
      p: `Who is the leader of the Opposition ${inEn}?`,
      pf: `Qui est le chef de l’opposition ${inFr}?`,
      o: ['{{oppositionLeader}}', ...oppositionWrong],
      of: ['{{oppositionLeader}}', ...oppositionWrongFr],
      a: 'a',
      e: consensus
        ? 'Nunavut and the Northwest Territories use consensus government, so there is no party-based Official Opposition leader.'
        : 'The Official Opposition is led by the leader of the largest party not in government. As of the last verification date, that is {{oppositionLeader}}.',
      ef: consensus
        ? 'Le Nunavut et les Territoires du Nord-Ouest fonctionnent par consensus : il n’y a pas de chef de l’opposition officielle issu d’un parti.'
        : 'L’opposition officielle est dirigée par le chef du plus grand parti qui n’est pas au pouvoir. À la dernière date de vérification, c’est {{oppositionLeader}}.',
    },
    {
      id: `reg-${String(nextId++).padStart(3, '0')}`,
      region: code,
      p: `Which political party is in power ${inEn}?`,
      pf: `Quel parti politique est au pouvoir ${inFr}?`,
      o: ['{{governingParty}}', ...partyWrong],
      of: ['{{governingParty}}', ...partyWrongFr],
      a: 'a',
      e: consensus
        ? 'Members are elected as independents and govern by consensus rather than by party caucus.'
        : `As of the last verification date, {{governingParty}} forms the government ${inEn}.`,
      ef: consensus
        ? 'Les députés sont élus comme indépendants et gouvernent par consensus plutôt que par caucus de parti.'
        : `À la dernière date de vérification, {{governingParty}} forme le gouvernement ${inFr}.`,
    },
  );
}

export default build(
  'canadas-regions',
  'Discover Canada — Canada’s Regions (current officials)',
  rows,
);
