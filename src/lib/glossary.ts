import type { ChapterId } from '../content/schema';
import type { LocalizedText } from './i18n';

export type GlossaryTerm = {
  id: string;
  term: LocalizedText;
  also?: LocalizedText;
  definition: LocalizedText;
  chapter: ChapterId;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'charter',
    term: { en: 'Charter of Rights and Freedoms', fr: 'Charte des droits et libertés' },
    definition: {
      en: 'Part of the Constitution. It lists fundamental, democratic, mobility, legal, equality, and language rights, and says Aboriginal rights are not taken away.',
      fr: 'Partie de la Constitution. Elle énonce les libertés fondamentales et les droits démocratiques, de circulation, juridiques, à l’égalité et linguistiques, et précise que les droits des Autochtones ne sont pas diminués.',
    },
    chapter: 'rights-and-responsibilities',
  },
  {
    id: 'habeas-corpus',
    term: { en: 'habeas corpus', fr: 'habeas corpus' },
    definition: {
      en: 'You cannot be held without a lawful reason, and you can ask a court to review the detention.',
      fr: 'Personne ne peut être détenu sans motif légal, et on peut demander à un tribunal d’examiner la détention.',
    },
    chapter: 'rights-and-responsibilities',
  },
  {
    id: 'jury',
    term: { en: 'jury', fr: 'jury' },
    definition: {
      en: 'A group of citizens who hear evidence and decide facts in some trials. Serving if summoned is a responsibility of citizenship.',
      fr: 'Un groupe de citoyens qui entend la preuve et tranche les faits dans certains procès. Servir si l’on est convoqué est un devoir de citoyenneté.',
    },
    chapter: 'rights-and-responsibilities',
  },
  {
    id: 'oath',
    term: { en: 'oath of citizenship', fr: 'serment de citoyenneté' },
    definition: {
      en: 'The public promise new citizens make at the ceremony: allegiance to the Crown, observing the laws including the Constitution and Aboriginal and treaty rights, and fulfilling the duties of a citizen.',
      fr: 'La promesse publique des nouveaux citoyens à la cérémonie : allégeance à la Couronne, respect des lois y compris la Constitution et les droits ancestraux et issus de traités, et accomplissement des devoirs de citoyen.',
    },
    chapter: 'rights-and-responsibilities',
  },
  {
    id: 'crown',
    term: { en: 'the Crown', fr: 'la Couronne' },
    definition: {
      en: 'The state in the name of the monarch. The Crown is one of the three parts of Parliament, prosecutes most criminal cases, and is the other party to treaties with Indigenous peoples.',
      fr: 'L’État au nom du souverain. La Couronne est l’une des trois composantes du Parlement, poursuit la plupart des affaires criminelles, et est l’autre partie aux traités avec les peuples autochtones.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'constitutional-monarchy',
    term: { en: 'constitutional monarchy', fr: 'monarchie constitutionnelle' },
    definition: {
      en: 'The monarch is Head of State, but must act within the Constitution and almost always on the advice of ministers who have the confidence of the Commons.',
      fr: 'Le souverain est chef de l’État, mais agit dans le cadre de la Constitution et presque toujours sur l’avis de ministres qui ont la confiance des Communes.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'parliamentary-democracy',
    term: { en: 'parliamentary democracy', fr: 'démocratie parlementaire' },
    definition: {
      en: 'Voters elect a House of Commons. The government stays in office only while it has the confidence of that House.',
      fr: 'Les électeurs élisent la Chambre des communes. Le gouvernement reste au pouvoir seulement s’il a la confiance de cette Chambre.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'federalism',
    term: { en: 'federalism', fr: 'fédéralisme' },
    also: { en: 'federation', fr: 'fédération' },
    definition: {
      en: 'Power is divided by the Constitution between the federal government and the provinces (with territories and municipalities in the mix).',
      fr: 'La Constitution partage le pouvoir entre le gouvernement fédéral et les provinces (avec les territoires et les municipalités).',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'governor-general',
    term: { en: 'Governor General', fr: 'gouverneur général' },
    definition: {
      en: 'The monarch’s representative in Canada: grants Royal Assent, reads the Speech from the Throne, and asks a party leader to form a government.',
      fr: 'Le représentant du souverain au Canada : accorde la sanction royale, lit le discours du Trône et demande à un chef de parti de former un gouvernement.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'prime-minister',
    term: { en: 'Prime Minister', fr: 'premier ministre' },
    definition: {
      en: 'Head of Government. Leader of the party that can command the House of Commons, and the person who names Cabinet.',
      fr: 'Chef du gouvernement. Chef du parti capable d’obtenir l’appui de la Chambre des communes, et personne qui nomme le Cabinet.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'commons',
    term: { en: 'House of Commons', fr: 'Chambre des communes' },
    definition: {
      en: 'The elected house of Parliament. Confidence votes happen here. Each MP represents one riding.',
      fr: 'La chambre élue du Parlement. Les votes de confiance s’y tiennent. Chaque député représente une circonscription.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'mp',
    term: { en: 'MP', fr: 'député' },
    also: { en: 'Member of Parliament', fr: 'député fédéral' },
    definition: {
      en: 'An elected member of the House of Commons. One MP per riding, chosen by first past the post.',
      fr: 'Un membre élu de la Chambre des communes. Un député par circonscription, élu au scrutin majoritaire uninominal.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'senate',
    term: { en: 'Senate', fr: 'Sénat' },
    definition: {
      en: 'The appointed house of Parliament. Senators are named on the Prime Minister’s advice and review legislation.',
      fr: 'La chambre nommée du Parlement. Les sénateurs sont choisis sur avis du premier ministre et révisent les projets de loi.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'cabinet',
    term: { en: 'Cabinet', fr: 'Cabinet' },
    definition: {
      en: 'The Prime Minister’s ministers. They are usually MPs. Cabinet solidarity means they defend government decisions in public.',
      fr: 'Les ministres du premier ministre, habituellement des députés. La solidarité ministérielle veut qu’ils défendent en public les décisions du gouvernement.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'speaker',
    term: { en: 'Speaker of the House', fr: 'président de la Chambre' },
    definition: {
      en: 'The MP elected by the Commons to chair debates impartially. Not the Prime Minister.',
      fr: 'Le député élu par les Communes pour diriger les débats de façon impartiale. Ce n’est pas le premier ministre.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'royal-assent',
    term: { en: 'Royal Assent', fr: 'sanction royale' },
    definition: {
      en: 'The last step that turns a bill into law, given in the monarch’s name (in practice by the Governor General).',
      fr: 'La dernière étape qui transforme un projet de loi en loi, donnée au nom du souverain (en pratique par le gouverneur général).',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'lieutenant-governor',
    term: { en: 'Lieutenant Governor', fr: 'lieutenant-gouverneur' },
    definition: {
      en: 'The Crown’s representative in a province. Territories have commissioners instead.',
      fr: 'Le représentant de la Couronne dans une province. Les territoires ont des commissaires.',
    },
    chapter: 'how-canadians-govern-themselves',
  },
  {
    id: 'responsible-government',
    term: { en: 'responsible government', fr: 'gouvernement responsable' },
    definition: {
      en: 'A Cabinet that must keep the confidence of an elected assembly. A 19th-century turning point, mostly a convention rather than one statute.',
      fr: 'Un Cabinet qui doit conserver la confiance d’une assemblée élue. Un tournant du XIXe siècle, surtout une convention plutôt qu’une seule loi.',
    },
    chapter: 'canadas-history',
  },
  {
    id: 'confederation',
    term: { en: 'Confederation', fr: 'Confédération' },
    definition: {
      en: 'The 1867 union that created the Dominion of Canada (Ontario, Quebec, Nova Scotia, New Brunswick first). Later provinces and territories joined.',
      fr: 'L’union de 1867 qui a créé le Dominion du Canada (d’abord l’Ontario, le Québec, la Nouvelle-Écosse et le Nouveau-Brunswick). D’autres provinces et territoires se sont joints plus tard.',
    },
    chapter: 'canadas-history',
  },
  {
    id: 'riding',
    term: { en: 'riding', fr: 'circonscription' },
    also: { en: 'electoral district', fr: 'circonscription électorale' },
    definition: {
      en: 'The geographic seat that elects one MP. Your vote is counted where you live.',
      fr: 'Le siège géographique qui élit un député. Votre vote est compté là où vous habitez.',
    },
    chapter: 'federal-elections',
  },
  {
    id: 'fptp',
    term: { en: 'first past the post', fr: 'scrutin majoritaire uninominal' },
    also: { en: 'single-member plurality', fr: 'scrutin uninominal à un tour' },
    definition: {
      en: 'The candidate with the most votes in a riding wins the seat, even without 50%. Seats, not the national popular vote, decide who can govern.',
      fr: 'Le candidat qui a le plus de voix dans une circonscription remporte le siège, même sans 50 %. Ce sont les sièges, et non le vote populaire national, qui décident qui peut gouverner.',
    },
    chapter: 'federal-elections',
  },
  {
    id: 'writ',
    term: { en: 'writ of election', fr: 'bref d’élection' },
    definition: {
      en: 'The official order that starts a federal election contest in a riding.',
      fr: 'L’ordre officiel qui lance une élection fédérale dans une circonscription.',
    },
    chapter: 'federal-elections',
  },
  {
    id: 'returning-officer',
    term: { en: 'returning officer', fr: 'directeur du scrutin' },
    definition: {
      en: 'The local Elections Canada official who runs the vote in a riding: staff, polls, and results.',
      fr: 'Le fonctionnaire local d’Élections Canada qui organise le scrutin dans une circonscription : personnel, bureaux de vote et résultats.',
    },
    chapter: 'federal-elections',
  },
];
