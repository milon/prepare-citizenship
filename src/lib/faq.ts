export const OFFICIAL_GUIDE_URL =
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/test/study.html';
export const OFFICIAL_PDF_URL =
  'https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover.pdf';
export const GITHUB_ISSUES_URL = 'https://github.com/milon/prepare-citizenship/issues';

export type FaqItem = {
  id: string;
  question: string;
  html: string;
};

export function faqItems(opts: { questionCount: number; lastVerified: string }): FaqItem[] {
  const { questionCount, lastVerified } = opts;
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
      html: `<p>Most cards come from the question bank. You rate each card as still learning or known. Cards move through three boxes: learning (due the next day), reviewing (three days), and known (seven days). A miss sends the card back to learning and due immediately.</p>
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
      html: `<p>Not yet. The question files can hold French strings, but the interface and content you see today are English only.</p>`,
    },
    {
      id: 'mistake',
      question: 'I think a question is wrong. What should I do?',
      html: `<p>Check the <a href="${OFFICIAL_GUIDE_URL}">official study guide</a> first. If this site still looks wrong, open a <a href="${GITHUB_ISSUES_URL}">GitHub issue</a> with the question wording and what you expected.</p>`,
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
