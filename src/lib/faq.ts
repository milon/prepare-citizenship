export const OFFICIAL_GUIDE_URL =
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/test/study.html';
export const OFFICIAL_PDF_URL =
  'https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover.pdf';
export const GITHUB_ISSUES_URL = 'https://github.com/milon/prepare-citizenship/issues';
export const GITHUB_CONTENT_ISSUE_URL =
  'https://github.com/milon/prepare-citizenship/issues/new?template=content-mistake.yml';
export const OFFICIAL_GUIDE_URL_FR =
  'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/citoyennete-canadienne/examen/etudier.html';
export const OFFICIAL_PDF_URL_FR =
  'https://www.canada.ca/content/dam/ircc/migration/ircc/francais/pdf/pub/decouvrir.pdf';

export type FaqItem = {
  id: string;
  question: string;
  html: string;
};

export function faqItems(
  opts: { questionCount: number; lastVerified: string },
  locale: 'en' | 'fr' = 'en',
): FaqItem[] {
  const { questionCount, lastVerified } = opts;
  if (locale === 'fr') {
    return [
      {
        id: 'official',
        question: 'Est-ce l’examen officiel de citoyenneté?',
        html: `<p>Non. Prepare Citizenship est un outil d’étude indépendant. Il n’est pas affilié à Immigration, Réfugiés et Citoyenneté Canada, et les questions présentées ici ne sont pas celles de l’examen réel.</p>
<p>Utilisez ce site pour apprendre la matière et vérifier vos connaissances dans les conditions de l’examen. Pour la matière officielle, consultez le <a href="${OFFICIAL_GUIDE_URL_FR}">guide d’étude officiel</a> ou le <a href="${OFFICIAL_PDF_URL_FR}">PDF Découvrir le Canada</a>.</p>`,
      },
      {
        id: 'how-to-study',
        question: 'Comment utiliser ce site?',
        html: `<p>Lisez un chapitre, révisez la même matière avec les cartes-éclair, puis faites un quiz. Lorsque vous réussissez plusieurs examens blancs de suite, vous êtes plus près d’être prêt qu’après une seule tentative chanceuse.</p>
<p>Le tableau de bord Aujourd’hui recommande une prochaine étape à partir du progrès enregistré sur cet appareil : commencer le premier chapitre, revoir les cartes dues, travailler un chapitre faible ou passer un examen blanc.</p>`,
      },
      {
        id: 'question-bank',
        question: 'S’agit-il des vraies questions d’IRCC?',
        html: `<p>Non. Les ${questionCount} questions sont des reformulations originales de faits tirés de <cite>Découvrir le Canada</cite>. Le libellé, les choix et les explications ne seront pas identiques à ceux de l’examen d’IRCC.</p>
<p>Si un fait présenté ici contredit le guide officiel, fiez-vous au guide.</p>`,
      },
      {
        id: 'mock',
        question: 'Comment fonctionne l’examen blanc?',
        html: `<p>Chaque examen blanc compte 20 questions et dure 45 minutes; il faut 15 bonnes réponses pour réussir. La durée et la note de passage ne sont pas modifiables : elles correspondent au format de l’examen auquel vous vous préparez.</p>
<p>Les questions couvrent tous les chapitres, comprennent des éléments régionaux pour la province ou le territoire choisi dans les Réglages et, lorsque la banque le permet, évitent les questions de vos trois derniers examens blancs.</p>`,
      },
      {
        id: 'province',
        question: 'Pourquoi dois-je choisir une province ou un territoire?',
        html: `<p>Le chapitre Les régions du Canada comprend des faits propres à votre lieu de résidence. Les examens blancs et les exercices peuvent présenter ces questions, comme l’examen réel vous demande de connaître votre région.</p>
<p>Vous pouvez modifier ce choix plus tard dans les Réglages. Le progrès déjà enregistré sera conservé.</p>`,
      },
      {
        id: 'progress',
        question: 'Où mon progrès est-il enregistré?',
        html: `<p>Uniquement sur cet appareil, dans le navigateur. Il n’y a aucun compte et rien n’est envoyé à un serveur. Effacer les données du site, changer de navigateur ou utiliser la navigation privée peut supprimer votre progrès.</p>
<p>Exportez une copie JSON depuis les Réglages avant de réinitialiser un téléphone ou d’effacer les données du navigateur. L’importation restaure cette copie. Ajouter le site à l’écran d’accueil réduit le risque qu’iOS supprime les données enregistrées.</p>`,
      },
      {
        id: 'offline',
        question: 'Le site fonctionne-t-il hors ligne?',
        html: `<p>Oui, après un premier chargement réussi. Un service worker conserve les pages d’étude, les questions et les ressources afin que vous puissiez lire les chapitres, utiliser les cartes et faire des quiz sans connexion.</p>
<p>Le progrès demeure dans ce navigateur. Il ne se synchronise pas avec un autre téléphone, sauf si vous exportez puis importez le fichier de sauvegarde.</p>`,
      },
      {
        id: 'flashcards',
        question: 'Comment fonctionnent les cartes-éclair?',
        html: `<p>La plupart des cartes proviennent de la banque de questions. Vous indiquez si chaque carte est encore à apprendre ou si vous la connaissez. Les cartes passent par trois boîtes : apprentissage (à revoir aujourd’hui), révision (dans trois jours) et connue (dans sept jours). Une erreur renvoie la carte à l’apprentissage et la rend immédiatement disponible.</p>
<p>Vous pouvez filtrer les cartes par chapitre et ne revoir que celles manquées dans les quiz.</p>`,
      },
      {
        id: 'readiness',
        question: 'Que signifie « prêt » dans le tableau de bord?',
        html: `<p>Le verdict de préparation reste verrouillé jusqu’à ce que vous ayez terminé trois examens blancs. Ensuite, « Prêt » signifie que vos trois derniers examens blancs ont chacun obtenu au moins 15/20 et que chaque chapitre comptant au moins dix réponses enregistrées atteint une précision d’au moins 70 %.</p>
<p>Les chapitres comptant moins de dix réponses ne bloquent pas le verdict; ils s’affichent comme étant à poursuivre. Un seul bon examen blanc ne suffit pas, car un tirage de 20 questions peut varier.</p>`,
      },
      {
        id: 'current',
        question: 'Pourquoi certaines réponses nomment-elles des titulaires actuels?',
        html: `<p>Des faits comme le nom du premier ministre, du gouverneur général, du chef de l’État et du parti au pouvoir peuvent changer. Ces noms sont conservés dans un seul fichier et insérés dans les questions au moment de la compilation. Dernière vérification : ${lastVerified}.</p>
<p>Si un titulaire a changé depuis cette date, confirmez l’information dans le guide officiel et les nouvelles récentes avant l’examen.</p>`,
      },
      {
        id: 'privacy',
        question: 'Le site est-il gratuit et recueillez-vous des données?',
        html: `<p>Le site est gratuit. Il n’y a ni compte, ni analytique, ni publicité. Votre progrès ne quitte jamais le navigateur, sauf si vous l’exportez vous-même.</p>`,
      },
      {
        id: 'french',
        question: 'Existe-t-il une version française?',
        html: `<p>Oui. Les Réglages permettent de choisir la langue. L’interface, les chapitres, les cartes-éclair, les exercices et les examens blancs sont offerts en anglais et en français.</p>
<p>La matière officielle est également offerte en français : le <a href="${OFFICIAL_GUIDE_URL_FR}">guide</a> et le <a href="${OFFICIAL_PDF_URL_FR}">PDF Découvrir le Canada</a>.</p>`,
      },
      {
        id: 'mistake',
        question: 'Je crois qu’une question contient une erreur. Que faire?',
        html: `<p>Consultez d’abord le <a href="${OFFICIAL_GUIDE_URL_FR}">guide d’étude officiel</a>. Si le site semble toujours erroné, ouvrez un <a href="${GITHUB_CONTENT_ISSUE_URL}">signalement d’erreur de contenu</a> en indiquant l’identifiant de la question et la réponse attendue.</p>`,
      },
    ];
  }
  return [
    {
      id: 'official',
      question: 'Is this the official citizenship test?',
      html: `<p>No. Prepare Citizenship is an independent study tool. It is not affiliated with Immigration, Refugees and Citizenship Canada, and the questions here are not the real test bank.</p>
<p>Use this site to learn the material and check whether you can recall it under exam conditions. For the authoritative study material, read the <a href="${OFFICIAL_GUIDE_URL}">official study guide</a> or the <a href="${OFFICIAL_PDF_URL}">Discover Canada PDF</a>.</p>`,
    },
    {
      id: 'how-to-study',
      question: 'How should I use this site?',
      html: `<p>Read a chapter, drill the same material as flashcards, then sit a practice quiz. When you can pass a few mocks in a row, you are closer to test-ready than after one lucky sitting.</p>
<p>The dashboard on Today recommends a next step from the progress stored on this device: start chapter one, clear due cards, drill a weak chapter, or sit a mock.</p>`,
    },
    {
      id: 'question-bank',
      question: 'Are these the real IRCC questions?',
      html: `<p>No. The ${questionCount} items here are original paraphrases of facts from <cite>Discover Canada</cite>, written for study. Wording, options, and explanations will not match the test you sit at an IRCC office.</p>
<p>If a fact here disagrees with the official guide, trust the guide.</p>`,
    },
    {
      id: 'mock',
      question: 'How does the mock exam work?',
      html: `<p>Every mock is 20 questions, 45 minutes, with 15 correct to pass. Length and pass mark are not configurable — they match the real test format people study toward.</p>
<p>Questions are drawn across chapters, include regional items for the province or territory you set in Settings, and avoid repeating anything from your last three mocks when the bank allows it.</p>`,
    },
    {
      id: 'province',
      question: 'Why do I have to pick a province or territory?',
      html: `<p>Canada’s Regions includes facts that are specific to where you live. Mocks and practice can include those items for the place you choose, the same way the real test expects you to know your own region.</p>
<p>You can change the selection later in Settings. Progress already recorded is not thrown away.</p>`,
    },
    {
      id: 'progress',
      question: 'Where is my progress stored?',
      html: `<p>On this device only, in the browser. There is no account and nothing is sent to a server. Clearing site data, switching browsers, or using private mode can wipe it.</p>
<p>Export a JSON backup from Settings before you reset a phone or clear cookies. Import restores that snapshot. Adding the site to your home screen makes iOS less likely to evict stored progress.</p>`,
    },
    {
      id: 'offline',
      question: 'Does it work offline?',
      html: `<p>Yes, after the first successful load. A service worker keeps the study pages, questions, and assets so you can read chapters, flip cards, and sit quizzes without a network.</p>
<p>Progress still lives in this browser. It does not sync to another phone unless you export and import the backup file.</p>`,
    },
    {
      id: 'flashcards',
      question: 'How do flashcards work?',
      html: `<p>Most cards come from the question bank. You rate each card as still learning or known. Cards move through three boxes: learning (due today), reviewing (three days), and known (seven days). A miss sends the card back to learning and due immediately.</p>
      <p>You can filter by chapter and review only cards you have missed in quizzes.</p>`,
    },
    {
      id: 'readiness',
      question: 'What does “ready” mean on the dashboard?',
      html: `<p>Readiness stays locked until you have finished three mocks. After that, Ready means your last three mocks each scored at least 15/20, and every chapter where you have at least ten recorded answers is at 70% accuracy or better.</p>
<p>Chapters with fewer than ten answers do not block Ready; they show as keep practicing. One good mock is not enough — a 20-question draw is noisy.</p>`,
    },
    {
      id: 'current',
      question: 'Why do some answers name current officials?',
      html: `<p>Facts such as the prime minister, the Governor General, the head of state, and the party in power change. Those names live in one file and are filled into questions at build time, last checked ${lastVerified}.</p>
<p>If an office has changed since that date, confirm it against the official guide and current news before you sit the test.</p>`,
    },
    {
      id: 'privacy',
      question: 'Is this free, and do you collect data?',
      html: `<p>The site is free to use. There are no accounts, no analytics, and no ads. Progress never leaves the browser unless you export it yourself.</p>`,
    },
    {
      id: 'french',
      question: 'Is there a French version?',
      html: `<p>Yes. Settings has a language toggle. The interface, chapters, flashcards, practice, and mock are available in English and French.</p>
<p>The official study material is also in French: the <a href="${OFFICIAL_GUIDE_URL_FR}">guide</a> and the <a href="${OFFICIAL_PDF_URL_FR}">Découvrir le Canada PDF</a>.</p>`,
    },
    {
      id: 'mistake',
      question: 'I think a question is wrong. What should I do?',
      html: `<p>Check the <a href="${OFFICIAL_GUIDE_URL}">official study guide</a> first. If this site still looks wrong, open a <a href="${GITHUB_CONTENT_ISSUE_URL}">content mistake report</a> with the question id and what you expected.</p>`,
    },
  ];
}

export function faqPlainText(html: string): string {
  return html
    .replace(/<\/(p|li|h[1-6])>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
