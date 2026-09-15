import type { ChapterId, RegionCode } from '../content/schema';
import { CHAPTERS, REGION_LABELS } from './chapters';

export type Locale = 'en' | 'fr';

export type LocalizedText = {
  en: string;
  fr?: string | null;
};

const CHAPTER_TITLE_FR: Record<ChapterId, string> = {
  'rights-and-responsibilities': 'Droits et responsabilités',
  'who-we-are': 'Qui nous sommes',
  'canadas-history': 'L’histoire du Canada',
  'modern-canada': 'Le Canada moderne',
  'how-canadians-govern-themselves': 'Comment les Canadiens se gouvernent',
  'federal-elections': 'Les élections fédérales',
  'the-justice-system': 'Le système judiciaire',
  'canadian-symbols': 'Les symboles canadiens',
  'canadas-economy': 'L’économie du Canada',
  'canadas-regions': 'Les régions du Canada',
};

const SOURCE_HEADING_FR: Record<ChapterId, string> = {
  'rights-and-responsibilities': 'Droits et responsabilités de la citoyenneté',
  'who-we-are': 'Qui nous sommes',
  'canadas-history': 'L’histoire du Canada',
  'modern-canada': 'Le Canada moderne',
  'how-canadians-govern-themselves': 'Comment les Canadiens se gouvernent',
  'federal-elections': 'Les élections fédérales',
  'the-justice-system': 'Le système judiciaire',
  'canadian-symbols': 'Les symboles canadiens',
  'canadas-economy': 'L’économie du Canada',
  'canadas-regions': 'Les régions du Canada',
};

export const REGION_LABELS_FR: Record<RegionCode, string> = {
  ab: 'Alberta',
  bc: 'Colombie-Britannique',
  mb: 'Manitoba',
  nb: 'Nouveau-Brunswick',
  nl: 'Terre-Neuve-et-Labrador',
  ns: 'Nouvelle-Écosse',
  nt: 'Territoires du Nord-Ouest',
  nu: 'Nunavut',
  on: 'Ontario',
  pe: 'Île-du-Prince-Édouard',
  qc: 'Québec',
  sk: 'Saskatchewan',
  yt: 'Yukon',
};

type Dict = Record<string, string>;

const en: Dict = {
  'nav.today': 'Today',
  'nav.chapters': 'Chapters',
  'nav.flashcards': 'Flashcards',
  'nav.cards': 'Cards',
  'nav.practice': 'Practice',
  'nav.mock': 'Mock exam',
  'nav.mockShort': 'Mock',
  'nav.progress': 'Progress',
  'nav.faq': 'FAQ',
  'nav.settings': 'Settings',
  'nav.search': 'Search',
  'nav.glossary': 'Glossary',
  'nav.ceremony': 'Ceremony',
  'nav.session': 'Today’s session',
  'nav.primary': 'Primary',
  'nav.sections': 'Sections',
  'skip': 'Skip to content',
  'brand.addName': 'Add your name',
  'rail.streak': 'Study streak',
  'rail.accuracy': 'Accuracy',
  'rail.noAnswers': 'No answers yet',
  'rail.days': '{n} days',
  'rail.day': '{n} day',
  'rail.of': '{pct}% of {total}',
  'theme.system': 'Auto',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.switch': 'Theme: {current}. Switch to {next}.',
  'storage.banner':
    'Progress won’t save in this browser. Check that you are not in private mode and that storage is not full.',
  'gate.eyebrow': 'First step',
  'gate.title': 'Choose your province or territory',
  'gate.lede':
    'Mock exams include questions about the place you live. You can change this later in Settings.',
  'gate.continue': 'Continue',
  'gate.storage':
    'Progress won’t save in this browser. Check that you are not in private mode with storage blocked.',
  'field.province': 'Province or territory',
  'field.select': 'Select one',
  'cards.eyebrow': 'Recall',
  'cards.title': 'Flashcards',
  'cards.lede': 'Flip the card, then mark whether you knew it.',
  'cards.howTitle': 'How scheduling works',
  'cards.howBody':
    'New and still-learning cards are due today. After “Got it,” they return in three days, then a week. “Mark as known” parks a card in the known box.',
  'cards.chapter': 'Chapter',
  'cards.all': 'All chapters',
  'cards.deck': 'Deck',
  'cards.due': 'Due now',
  'cards.shuffle': 'Shuffle all',
  'cards.mistakes': 'Review mistakes',
  'cards.none': 'No cards in this deck. Try another chapter or shuffle all.',
  'cards.saveFailed': 'Progress won’t save in this browser.',
  'cards.prompt': 'Prompt',
  'cards.answer': 'Answer',
  'cards.still': 'Still learning',
  'cards.gotIt': 'Got it',
  'cards.known': 'Mark as known',
  'cards.print': 'Print this deck',
  'cards.box1': 'Learning',
  'cards.box2': 'Reviewing',
  'cards.box3': 'Known',
  'cards.noCards': 'No cards',
  'cards.of': '{n} of {total}',
  'cards.left': '{n} left',
  'cards.progressLabel': 'Deck progress',
  'cards.statusPrompt': 'Prompt showing',
  'cards.statusAnswer': 'Answer showing',
  'cards.statusDone': 'Deck complete',
  'cards.flipPrompt': 'Flip card. Prompt is showing.',
  'cards.flipAnswer': 'Flip card. Answer is showing.',
  'cards.tapHint': 'Tap to flip',
  'cards.tapBack': 'Tap to go back',
  'cards.hear': 'Hear this side',
  'practice.eyebrow': 'Practice',
  'practice.title': 'Chapter quiz',
  'practice.lede':
    'Ten questions, untimed. You’ll see the answer and a short explanation after each choice.',
  'practice.set': 'Set',
  'practice.weakest': 'My weakest chapter',
  'practice.none': 'No questions',
  'practice.position': 'Question {n} of {total}',
  'practice.tf': 'True or false',
  'practice.mcq': 'Multiple choice',
  'practice.keys': 'Number keys 1 to 4 select an answer.',
  'practice.correct': 'Correct',
  'practice.incorrect': 'Incorrect',
  'practice.next': 'Next question',
  'practice.results': 'See results',
  'practice.resultsTitle': 'Results',
  'practice.score': 'You scored {score} / {total}.',
  'practice.again': 'Practice again',
  'practice.weakWarn':
    'Not enough quiz data yet for a weakest-chapter set. Showing a mixed practice instead.',
  'practice.weakOk': 'Practicing your weakest chapter so far.',
  'practice.hear': 'Hear the question',
  'speech.stop': 'Stop audio',
  'speech.loading': 'Preparing audio',
  'mock.eyebrow': 'Mock exam',
  'mock.title': '20 questions, 45 minutes',
  'mock.lede':
    'Every attempt is generated from the question bank: two questions per chapter, including your region. It avoids earlier mock questions while each chapter has unused material and gives missed questions priority. Pass is 15/20; answers stay hidden until you submit.',
  'mock.luck': 'Good luck, {name}.',
  'mock.start': 'Start exam',
  'mock.fresh': 'Start a fresh mock',
  'mock.replay': 'Retry the same questions',
  'mock.warning': 'Five minutes remaining.',
  'mock.flagged': 'Flagged',
  'mock.flag': 'Flag for review',
  'mock.unflag': 'Remove flag',
  'mock.prev': 'Previous',
  'mock.next': 'Next',
  'mock.submit': 'Submit exam',
  'mock.time': 'Time remaining {clock}',
  'mock.passed': 'Passed',
  'mock.failed': 'Below 15',
  'mock.reviewTitle': 'Your result',
  'mock.autosubmit': 'Time expired — this attempt was submitted automatically.',
  'mock.breakdown': 'Chapter breakdown',
  'mock.new': 'New attempt',
  'mock.yourAnswer': 'Your answer',
  'mock.correctAnswer': 'Correct answer:',
  'mock.unanswered': 'Unanswered',
  'mock.review': 'Review',
  'mock.passNamed': 'Pass, {name}: {score}/20.',
  'mock.pass': 'Pass: {score}/20.',
  'mock.failNamed': 'Not a pass, {name}: {score}/20. You need 15.',
  'mock.fail': 'Not a pass: {score}/20. You need 15.',
  'settings.eyebrow': 'Settings',
  'settings.title': 'Your study place',
  'settings.lede':
    'Everything here stays on this device. Change what you see, or back up your progress.',
  'settings.profile': 'Your profile',
  'settings.profileLede':
    'Your name greets you on the dashboard. Your province decides which regional questions appear.',
  'settings.name': 'Your name',
  'settings.optional': 'Optional',
  'settings.save': 'Save',
  'settings.saved': 'Saved.',
  'settings.display': 'Display',
  'settings.displayLede':
    'Language, theme, and text size stay on this device with your other progress. The theme button in the header switches between auto, light, and dark too.',
  'settings.language': 'Language',
  'settings.lang.en': 'English',
  'settings.lang.fr': 'Français',
  'settings.theme': 'Theme',
  'settings.theme.system': 'Match device',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.font': 'Text size',
  'settings.font.md': 'Default',
  'settings.font.lg': 'Large',
  'settings.font.xl': 'Extra large',
  'settings.fontHint': 'Scales every page, not just this one.',
  'settings.data': 'Your data',
  'settings.dataLede':
    'Progress stays on this device. Export a JSON backup before you clear the browser, or import one you saved earlier. Add this site to your home screen so iOS is less likely to evict stored progress.',
  'settings.export': 'Export progress',
  'settings.import': 'Import progress',
  'settings.reset': 'Reset progress',
  'settings.updates': 'App version',
  'settings.updatesLede':
    'The offline copy refreshes itself the next time you open the app with a connection. Check here if you want the newest questions right away.',
  'settings.checkUpdate': 'Check for updates',
  'settings.checking': 'Checking…',
  'settings.updateCurrent': 'You already have the newest version.',
  'settings.updateReady': 'New version found. Loading it now…',
  'settings.reloadNow': 'Reload now',
  'settings.updateOffline': 'You are offline. Connect to check for a new version.',
  'settings.updateError': 'Could not check just now. Try again in a moment.',
  'settings.updateNone':
    'This browser is not keeping an offline copy, so every visit loads the newest version.',
  'settings.about': 'About this site',
  'settings.aboutLede':
    'Independent practice, not the official test. The FAQ covers the mock format, where progress is stored, and how this bank differs from IRCC’s questions.',
  'settings.exported': 'Progress file downloaded.',
  'settings.imported': 'Progress imported.',
  'settings.resetOk': 'Progress reset.',
  'settings.importConfirm':
    'Importing will replace the progress saved on this device. Continue?',
  'settings.importTitle': 'Replace saved progress?',
  'settings.importCta': 'Import and replace',
  'settings.resetConfirm':
    'Reset quiz history, flashcards, and missed questions? Your name, province, language, and display settings will be kept.',
  'settings.resetTitle': 'Reset progress?',
  'settings.resetCta': 'Reset progress',
  'settings.cancel': 'Cancel',
  'settings.importFail': 'Could not save imported progress in this browser.',
  'settings.importJson': 'That file could not be read as JSON.',
  'settings.importInvalid': 'That file is not a progress export from this app.',
  'settings.importVersion': 'This app can only import schemaVersion 1 progress files.',
  'dash.progress': 'Progress',
  'dash.readinessHeading': 'Readiness dashboard',
  'dash.possessive': '{name}’s readiness',
  'dash.officials': 'Officials last checked {date}.',
  'dash.next': 'Recommended next',
  'dash.readiness': 'Readiness',
  'dash.seen': 'Questions seen',
  'dash.accuracy': 'Accuracy',
  'dash.streak': 'Study streak',
  'dash.streakDay': 'day in a row',
  'dash.streakDays': 'days in a row',
  'dash.due': 'Cards due',
  'dash.mocks': 'Mocks passed',
  'dash.mockAttempts': 'of {n} attempted',
  'dash.answers': '{correct} of {total} answers',
  'dash.noQuiz': 'No quiz answers yet',
  'dash.ofQuestions': 'of {total}',
  'dash.unique': 'unique questions answered',
  'dash.notStarted': 'Not started',
  'dash.gettingStarted': 'Getting started',
  'dash.unlock': 'Finish {n} more mock to unlock a readiness call.',
  'dash.unlocks': 'Finish {n} more mocks to unlock a readiness call.',
  'dash.testReady': 'Test ready',
  'dash.readyNote': 'Last three mocks passed and practiced chapters are at 70% or better.',
  'dash.notReady': 'Not ready yet',
  'dash.fixOne': '1 thing to fix before the test.',
  'dash.fixMany': '{n} things to fix before the test.',
  'dash.keep': 'Keep studying',
  'dash.summary': 'Progress summary',
  'dash.ready':
    'Ready — last three mocks passed, and practiced chapters are at 70% or better.',
  'dash.readyNamed':
    '{name}, you are ready — last three mocks passed, and practiced chapters are at 70% or better.',
  'dash.notReadyNamed': '{name}, not ready yet.',
  'dash.keepPracticing': 'Keep practicing:',
  'dash.byChapter': 'Accuracy by chapter',
  'dash.everyChapter': 'Every chapter',
  'dash.belowTarget': 'Red bars are below the 70% you want before the test.',
  'dash.noneAnswered':
    'Nothing answered yet. Take a practice quiz and every chapter gets a bar here.',
  'dash.noAnswers': 'No answers yet',
  'dash.needsWork': 'Needs work',
  'dash.onTrack': 'On track',
  'dash.keepStatus': 'Keep practicing',
  'dash.openFull': 'Open the full dashboard',
  'dash.jumpBack': 'Jump back in',
  'dash.threeWays': 'Four ways to study.',
  'dash.flashcards': 'Flashcards',
  'dash.freshDeck': 'Flip a fresh deck, three boxes',
  'dash.cardDue': '1 card due today',
  'dash.cardsDueToday': '{n} cards due today',
  'dash.practiceQuiz': 'Practice quiz',
  'dash.practiceBlurb': 'Ten questions, answers as you go',
  'dash.session': 'Today’s session',
  'dash.sessionBlurb': '8 due cards, then 8 weak-chapter questions',
  'dash.mockExam': 'Mock exam',
  'dash.mockBlurb': '20 questions · 45:00 · pass at 15',
  'dash.mockScores': 'Mock scores',
  'dash.recentMocks': 'Most recent attempts, newest last.',
  'dash.noMocks': 'No mocks yet. Sit one to start a readiness trend.',
  'dash.pass': 'Pass',
  'dash.below15': 'Below 15',
  'dash.startMock': 'Start a mock exam',
  'rec.read.title': 'Start with chapter one',
  'rec.read.blurb':
    'Read Rights and Responsibilities, then drill the same material as flashcards. Ten minutes is enough for a first session.',
  'rec.read.cta': 'Read the chapter',
  'rec.read.alt': 'Try a practice quiz',
  'rec.mock.first': 'Sit your first mock exam',
  'rec.mock.next': 'Sit mock exam #{n}',
  'rec.mock.blurb':
    '20 questions, 45 minutes, 15 to pass — the same shape as the real test. Readiness needs 3 passes.',
  'rec.mock.cta': 'Start mock exam',
  'rec.mock.alt': 'Practice 10 instead',
  'rec.drill.title': 'Drill {chapter}',
  'rec.drill.blurb':
    'It is at {rate} after {total} answers, below the 70% you want before the test.',
  'rec.drill.cta': 'Practice this chapter',
  'rec.drill.alt': 'Flashcards for it',
  'rec.cards.one': '1 flashcard due',
  'rec.cards.many': '{n} flashcards due',
  'rec.cards.blurb': 'Clear today’s box to keep the spaced schedule honest, then take a quiz.',
  'rec.cards.cta': 'Review cards',
  'rec.cards.alt': 'Practice quiz',
  'rec.maintain.title': 'You are tracking well',
  'rec.maintain.blurb':
    'Nothing is overdue. Keep the streak alive with a short set, or sit another mock to confirm.',
  'rec.maintain.cta': 'Practice quiz',
  'rec.maintain.alt': 'Mock exam',
  'reason.mock': 'A recent mock scored below 15/20.',
  'reason.chapter': '{chapter} is at {rate}% after {total} answers (need 70%).',
  'chapter.eyebrow': 'Chapter summary',
  'chapter.headOfState': 'Head of State',
  'chapter.gg': 'Governor General',
  'chapter.pm': 'Prime Minister',
  'chapter.speaker': 'Speaker of the House',
  'chapter.party': 'Party in power',
  'chapter.regions': 'Region subpages',
  'chapters.jump': 'Jump to a chapter',
  'chapters.all': 'All chapter summaries',
  'chapters.prev': 'Previous chapter',
  'chapters.next': 'Next chapter',
  'chapters.eyebrow': 'Discover Canada',
  'chapters.title': 'Chapter summaries',
  'chapters.lede':
    'These pages are original study notes, not a copy of the official guide. Learn the shape of each topic, then drill it with flashcards and a quiz.',
  'chapters.ten': 'The ten chapters',
  'chapters.tenBlurb': 'Each one ends with links to its flashcards and chapter quiz.',
  'chapters.regionsBlurb': 'Mock exams include questions about the province or territory you choose.',
  'home.chaptersBlurb': 'Original study notes, then flashcards and a quiz for each one.',
  'home.dashboard': 'Your study dashboard',
  'home.welcome': 'Welcome back, {name}',
  'home.lede':
    'Read a chapter, drill the flashcards, then sit a timed mock exam. Progress stays on this device.',
  'home.questions': '{n} questions',
  'home.verified': 'Verified {date}',
  'home.mockHowTitle': 'How mock exams work',
  'home.mockHowLede':
    'Mocks are generated when you start—not fixed papers. Each attempt draws 20 questions across all 10 chapters, includes your province or territory, and avoids earlier mock questions while fresh ones remain.',
  'home.mockTime': '45 minutes',
  'home.mockPass': '15/20 to pass',
  'home.mockUnlimited': 'Unlimited fresh attempts',
  'home.mockAdaptive':
    'Questions you missed get priority without replacing the balanced chapter mix. After submitting, review every answer or retry the exact same paper.',
  'home.mockCta': 'Start a mock exam',
  'home.installTitle': 'Add this app to your home screen',
  'home.installLede':
    'Study offline, and keep progress in an app icon instead of a browser tab. After the first visit it works without a network.',
  'home.installCta': 'Install app',
  'home.installIosCta': 'How to add it',
  'home.installIos1': 'Tap the Share button in Safari (the square with an arrow).',
  'home.installIos2': 'Scroll and choose Add to Home Screen.',
  'home.installIos3': 'Tap Add. Open it from the icon next time you study.',
  'daily.title': 'Question of the day',
  'daily.lede': 'One new question each calendar day. It stays put if you come back later today.',
  'daily.doneHours':
    'You’ve done today’s question. Come back tomorrow (in {n} hours).',
  'daily.doneHour': 'You’ve done today’s question. Come back tomorrow (in 1 hour).',
  'daily.doneMinutes':
    'You’ve done today’s question. Come back tomorrow (in {n} minutes).',
  'daily.doneMinute': 'You’ve done today’s question. Come back tomorrow (in 1 minute).',
  'daily.doneSoon':
    'You’ve done today’s question. Come back tomorrow (in less than a minute).',
  'daily.readChapter': 'Read {chapter}',
  'faq.title': 'Frequently asked questions',
  'faq.lede':
    'Independent practice for the Canadian citizenship test — not the test itself, and not affiliated with IRCC.',
  'contact.title': 'Still stuck?',
  'contact.lede':
    'If the FAQ did not cover it, send a message. Study progress stays on this device; only what you type here is emailed.',
  'contact.name': 'Your name',
  'contact.email': 'Email',
  'contact.message': 'Message',
  'contact.send': 'Send message',
  'contact.sending': 'Sending…',
  'contact.sent': 'Thanks. The message is on its way.',
  'contact.again': 'Send another',
  'contact.error': 'The message could not be sent. Check your connection and try again.',
  'faq.footBefore': 'Still stuck? Read a',
  'faq.chapter': 'chapter',
  'faq.try': 'try a',
  'faq.practice': 'practice quiz',
  'faq.orAdjust': 'or adjust',
  'notFound.title': 'Page not found',
  'notFound.lede':
    'That address is not a study page. Head back to the dashboard and pick a chapter from there.',
  'notFound.back': 'Back to today',
  'anthem.title': 'O Canada',
  'anthem.lede':
    'The national anthem is on the test and at the citizenship ceremony. Lyrics below are the official English and French versions. Recordings live on Canada.ca (Toronto Symphony Orchestra — credit the artists if you reuse them).',
  'anthem.listen': 'Listen on Canada.ca',
  'anthem.hear': 'Hear the title',
  'anthem.english': 'English lyrics',
  'anthem.french': 'French lyrics',
  'home.disclaimer': 'Independent practice, not the official test',
  'chapter.officialTitle': 'Read more',
  'chapter.officialLede':
    'Discover Canada, the official study guide, goes into more detail on this chapter. Open it on Canada.ca, or download the PDF.',
  'chapter.officialCta': 'Read this chapter on Canada.ca',
  'chapter.officialPdf': 'Discover Canada (PDF)',
  'chapter.print': 'Print this chapter',
  'chapter.hear': 'Hear this chapter',
  'search.title': 'Search',
  'search.lede':
    'Look up a phrase in the chapter notes or in the question prompts. Nothing leaves this device.',
  'search.placeholder': 'Try riding, Charter, or Yellowknife',
  'search.empty': 'Type at least two letters.',
  'search.none': 'No matches. Try a proper name, or a shorter word.',
  'search.chapter': 'Chapter',
  'search.question': 'Question',
  'search.count': '{n} matches',
  'glossary.title': 'Glossary',
  'glossary.lede':
    'Short definitions of terms the test likes to name. Each one links back to the chapter notes.',
  'glossary.also': 'Also called',
  'glossary.seeChapter': 'Read the chapter',
  'ceremony.title': 'Citizenship ceremony',
  'ceremony.lede':
    'The test is not the last step. At the ceremony you take the oath, you are already expected to know the rights and responsibilities of citizenship, and O Canada is sung.',
  'ceremony.oathTitle': 'The oath of citizenship',
  'ceremony.oathLede':
    'You may swear or solemnly affirm. The wording is official; this page quotes it so you can practise saying it out loud.',
  'ceremony.swear': 'I swear',
  'ceremony.affirm': 'I affirm',
  'ceremony.rightsTitle': 'Rights and responsibilities, recap',
  'ceremony.rightsLede':
    'The oath is a promise to observe the laws and fulfil your duties. The first chapter is the fuller list.',
  'ceremony.source': 'Read the official ceremony page on Canada.ca',
  'ceremony.openChapter': 'Open the chapter',
  'session.title': 'Today’s session',
  'session.lede':
    'A short timed loop: up to eight due flashcards, then eight questions from your weakest chapter. When the pile is gone, or fifteen minutes are up, we stop.',
  'session.cardsPhase': 'Due cards',
  'session.quizPhase': 'Weak-chapter quiz',
  'session.doneTitle': 'Session complete',
  'session.doneBlurb':
    'That is enough for one sitting. Come back tomorrow for whatever is due, or sit a mock if you want a longer test.',
  'session.noCards': 'No cards due',
  'session.timedOut': 'Time is up — finish this item, then we stop.',
  'session.time': 'Time {clock}',
  'session.weakNote': 'These eight come from your weakest chapter so far.',
  'session.mixedNote':
    'Not enough quiz history yet for a weakest chapter, so this is a mixed set.',
  'session.cardsRated': '{got} known this round, {learning} still learning.',
  'session.score': 'Quiz: {score} / {total}.',
  'session.empty': 'Nothing is due and there are no questions to drill. Read a chapter first.',
};

const fr: Dict = {
  'nav.today': 'Aujourd’hui',
  'nav.chapters': 'Chapitres',
  'nav.flashcards': 'Cartes',
  'nav.cards': 'Cartes',
  'nav.practice': 'Exercices',
  'nav.mock': 'Examen blanc',
  'nav.mockShort': 'Examen',
  'nav.progress': 'Progrès',
  'nav.faq': 'FAQ',
  'nav.settings': 'Réglages',
  'nav.search': 'Recherche',
  'nav.glossary': 'Lexique',
  'nav.ceremony': 'Cérémonie',
  'nav.session': 'Séance du jour',
  'nav.primary': 'Principal',
  'nav.sections': 'Sections',
  'skip': 'Aller au contenu',
  'brand.addName': 'Ajouter votre nom',
  'rail.streak': 'Série d’étude',
  'rail.accuracy': 'Précision',
  'rail.noAnswers': 'Pas encore de réponses',
  'rail.days': '{n} jours',
  'rail.day': '{n} jour',
  'rail.of': '{pct} % de {total}',
  'theme.system': 'Auto',
  'theme.light': 'Clair',
  'theme.dark': 'Sombre',
  'theme.switch': 'Thème : {current}. Passer à {next}.',
  'storage.banner':
    'Le progrès ne sera pas enregistré dans ce navigateur. Vérifiez que vous n’êtes pas en navigation privée et que le stockage n’est pas plein.',
  'gate.eyebrow': 'Première étape',
  'gate.title': 'Choisissez votre province ou territoire',
  'gate.lede':
    'Les examens blancs incluent des questions sur l’endroit où vous vivez. Vous pourrez changer ce choix plus tard dans les Réglages.',
  'gate.continue': 'Continuer',
  'gate.storage':
    'Le progrès ne sera pas enregistré dans ce navigateur. Vérifiez que vous n’êtes pas en navigation privée avec le stockage bloqué.',
  'field.province': 'Province ou territoire',
  'field.select': 'Choisissez',
  'cards.eyebrow': 'Mémorisation',
  'cards.title': 'Cartes-éclair',
  'cards.lede': 'Retournez la carte, puis indiquez si vous saviez la réponse.',
  'cards.howTitle': 'Comment fonctionne le calendrier',
  'cards.howBody':
    'Les nouvelles cartes et celles à revoir reviennent aujourd’hui. Après « Je savais », elles reviennent dans trois jours, puis une semaine. « Marquer comme connue » place la carte dans la boîte des cartes connues.',
  'cards.chapter': 'Chapitre',
  'cards.all': 'Tous les chapitres',
  'cards.deck': 'Paquet',
  'cards.due': 'À revoir',
  'cards.shuffle': 'Tout mélanger',
  'cards.mistakes': 'Revoir les erreurs',
  'cards.none': 'Aucune carte dans ce paquet. Essayez un autre chapitre ou mélangez tout.',
  'cards.saveFailed': 'Le progrès ne sera pas enregistré dans ce navigateur.',
  'cards.prompt': 'Question',
  'cards.answer': 'Réponse',
  'cards.still': 'À revoir',
  'cards.gotIt': 'Je savais',
  'cards.known': 'Marquer comme connue',
  'cards.print': 'Imprimer ce paquet',
  'cards.box1': 'Apprentissage',
  'cards.box2': 'Révision',
  'cards.box3': 'Connue',
  'cards.noCards': 'Aucune carte',
  'cards.of': '{n} sur {total}',
  'cards.left': 'Reste {n}',
  'cards.progressLabel': 'Progrès du paquet',
  'cards.statusPrompt': 'Question affichée',
  'cards.statusAnswer': 'Réponse affichée',
  'cards.statusDone': 'Paquet terminé',
  'cards.flipPrompt': 'Retourner la carte. La question est affichée.',
  'cards.flipAnswer': 'Retourner la carte. La réponse est affichée.',
  'cards.tapHint': 'Touchez pour retourner',
  'cards.tapBack': 'Touchez pour revenir',
  'cards.hear': 'Écouter ce côté',
  'practice.eyebrow': 'Exercices',
  'practice.title': 'Quiz de chapitre',
  'practice.lede':
    'Dix questions, sans limite de temps. La réponse et une courte explication s’affichent après chaque choix.',
  'practice.set': 'Ensemble',
  'practice.weakest': 'Mon chapitre le plus faible',
  'practice.none': 'Aucune question',
  'practice.position': 'Question {n} sur {total}',
  'practice.tf': 'Vrai ou faux',
  'practice.mcq': 'Choix multiple',
  'practice.keys': 'Les touches 1 à 4 choisissent une réponse.',
  'practice.correct': 'Bonne réponse',
  'practice.incorrect': 'Mauvaise réponse',
  'practice.next': 'Question suivante',
  'practice.results': 'Voir les résultats',
  'practice.resultsTitle': 'Résultats',
  'practice.score': 'Résultat : {score} / {total}.',
  'practice.again': 'Recommencer',
  'practice.weakWarn':
    'Pas assez de données pour un ensemble « chapitre faible ». Voici un mélange à la place.',
  'practice.weakOk': 'Vous pratiquez votre chapitre le plus faible pour l’instant.',
  'practice.hear': 'Écouter la question',
  'speech.stop': 'Arrêter l’audio',
  'speech.loading': 'Préparation de l’audio',
  'mock.eyebrow': 'Examen blanc',
  'mock.title': '20 questions, 45 minutes',
  'mock.lede':
    'Chaque tentative est générée à partir de la banque : deux questions par chapitre, y compris votre région. Elle évite les questions des examens précédents tant que chaque chapitre contient des questions inédites et donne priorité aux questions manquées. La note de passage est 15/20; les réponses restent cachées jusqu’à l’envoi.',
  'mock.luck': 'Bonne chance, {name}.',
  'mock.start': 'Commencer l’examen',
  'mock.fresh': 'Commencer un nouvel examen',
  'mock.replay': 'Reprendre les mêmes questions',
  'mock.warning': 'Cinq minutes restantes.',
  'mock.flagged': 'Marquée',
  'mock.flag': 'Marquer pour révision',
  'mock.unflag': 'Retirer le marqueur',
  'mock.prev': 'Précédente',
  'mock.next': 'Suivante',
  'mock.submit': 'Envoyer l’examen',
  'mock.time': 'Temps restant {clock}',
  'mock.passed': 'Réussi',
  'mock.failed': 'Sous 15',
  'mock.reviewTitle': 'Votre résultat',
  'mock.autosubmit': 'Temps écoulé — cette tentative a été envoyée automatiquement.',
  'mock.breakdown': 'Répartition par chapitre',
  'mock.new': 'Nouvelle tentative',
  'mock.yourAnswer': 'Votre réponse',
  'mock.correctAnswer': 'Bonne réponse :',
  'mock.unanswered': 'Sans réponse',
  'mock.review': 'Révision',
  'mock.passNamed': 'Réussi, {name} : {score}/20.',
  'mock.pass': 'Réussi : {score}/20.',
  'mock.failNamed': 'Échec, {name} : {score}/20. Il faut 15.',
  'mock.fail': 'Échec : {score}/20. Il faut 15.',
  'settings.eyebrow': 'Réglages',
  'settings.title': 'Votre espace d’étude',
  'settings.lede':
    'Tout reste sur cet appareil. Modifiez l’affichage ou sauvegardez votre progrès.',
  'settings.profile': 'Votre profil',
  'settings.profileLede':
    'Votre nom vous accueille dans le tableau de bord. Votre province détermine les questions régionales affichées.',
  'settings.name': 'Votre nom',
  'settings.optional': 'Facultatif',
  'settings.save': 'Enregistrer',
  'settings.saved': 'Enregistré.',
  'settings.display': 'Affichage',
  'settings.displayLede':
    'La langue, le thème et la taille du texte restent sur cet appareil avec le reste du progrès. Le bouton de thème dans l’en-tête permute aussi auto, clair et sombre.',
  'settings.language': 'Langue',
  'settings.lang.en': 'English',
  'settings.lang.fr': 'Français',
  'settings.theme': 'Thème',
  'settings.theme.system': 'Selon l’appareil',
  'settings.theme.light': 'Clair',
  'settings.theme.dark': 'Sombre',
  'settings.font': 'Taille du texte',
  'settings.font.md': 'Par défaut',
  'settings.font.lg': 'Grande',
  'settings.font.xl': 'Très grande',
  'settings.fontHint': 'S’applique à toutes les pages, pas seulement à celle-ci.',
  'settings.data': 'Vos données',
  'settings.dataLede':
    'Le progrès reste sur cet appareil. Exportez une copie JSON avant d’effacer le navigateur, ou importez une copie déjà enregistrée. Ajoutez le site à l’écran d’accueil pour qu’iOS soit moins susceptible d’effacer le progrès.',
  'settings.export': 'Exporter le progrès',
  'settings.import': 'Importer le progrès',
  'settings.reset': 'Réinitialiser le progrès',
  'settings.updates': 'Version de l’application',
  'settings.updatesLede':
    'La copie hors ligne se met à jour d’elle-même à la prochaine ouverture avec une connexion. Vérifiez ici pour obtenir les nouvelles questions tout de suite.',
  'settings.checkUpdate': 'Vérifier les mises à jour',
  'settings.checking': 'Vérification…',
  'settings.updateCurrent': 'Vous avez déjà la version la plus récente.',
  'settings.updateReady': 'Nouvelle version trouvée. Chargement en cours…',
  'settings.reloadNow': 'Recharger maintenant',
  'settings.updateOffline': 'Vous êtes hors ligne. Connectez-vous pour vérifier.',
  'settings.updateError': 'Vérification impossible pour le moment. Réessayez plus tard.',
  'settings.updateNone':
    'Ce navigateur ne conserve pas de copie hors ligne; chaque visite charge la version la plus récente.',
  'settings.about': 'À propos',
  'settings.aboutLede':
    'Exercice indépendant, pas l’examen officiel. La FAQ explique le format de l’examen blanc, le stockage du progrès, et en quoi cette banque diffère des questions d’IRCC.',
  'settings.exported': 'Fichier de progrès téléchargé.',
  'settings.imported': 'Progrès importé.',
  'settings.resetOk': 'Progrès réinitialisé.',
  'settings.importConfirm':
    'L’importation remplacera le progrès enregistré sur cet appareil. Continuer?',
  'settings.importTitle': 'Remplacer le progrès enregistré?',
  'settings.importCta': 'Importer et remplacer',
  'settings.resetConfirm':
    'Réinitialiser l’historique, les cartes et les erreurs? Votre nom, province, langue et affichage seront conservés.',
  'settings.resetTitle': 'Réinitialiser le progrès?',
  'settings.resetCta': 'Réinitialiser',
  'settings.cancel': 'Annuler',
  'settings.importFail': 'Impossible d’enregistrer le progrès importé dans ce navigateur.',
  'settings.importJson': 'Ce fichier n’a pas pu être lu comme JSON.',
  'settings.importInvalid': 'Ce fichier n’est pas une exportation de progrès de cette application.',
  'settings.importVersion':
    'Cette application peut seulement importer les fichiers de progrès schemaVersion 1.',
  'dash.progress': 'Progrès',
  'dash.readinessHeading': 'Tableau de préparation',
  'dash.possessive': 'Préparation de {name}',
  'dash.officials': 'Titulaires vérifiés le {date}.',
  'dash.next': 'Prochaine étape',
  'dash.readiness': 'Préparation',
  'dash.seen': 'Questions vues',
  'dash.accuracy': 'Précision',
  'dash.streak': 'Série d’étude',
  'dash.streakDay': 'jour de suite',
  'dash.streakDays': 'jours de suite',
  'dash.due': 'Cartes à revoir',
  'dash.mocks': 'Examens réussis',
  'dash.mockAttempts': 'sur {n} tentés',
  'dash.answers': '{correct} sur {total} réponses',
  'dash.noQuiz': 'Pas encore de quiz',
  'dash.ofQuestions': 'sur {total}',
  'dash.unique': 'questions uniques répondues',
  'dash.notStarted': 'Pas commencé',
  'dash.gettingStarted': 'En cours',
  'dash.unlock': 'Terminez encore {n} examen blanc pour débloquer un verdict.',
  'dash.unlocks': 'Terminez encore {n} examens blancs pour débloquer un verdict.',
  'dash.testReady': 'Prêt pour l’examen',
  'dash.readyNote':
    'Les trois derniers examens blancs sont réussis et les chapitres pratiqués sont à 70 % ou plus.',
  'dash.notReady': 'Pas encore prêt',
  'dash.fixOne': '1 point à corriger avant l’examen.',
  'dash.fixMany': '{n} points à corriger avant l’examen.',
  'dash.keep': 'Continuer',
  'dash.summary': 'Résumé du progrès',
  'dash.ready':
    'Prêt — les trois derniers examens blancs sont réussis et les chapitres pratiqués sont à 70 % ou plus.',
  'dash.readyNamed':
    '{name}, vous êtes prêt — les trois derniers examens blancs sont réussis et les chapitres pratiqués sont à 70 % ou plus.',
  'dash.notReadyNamed': '{name}, vous n’êtes pas encore prêt.',
  'dash.keepPracticing': 'À poursuivre :',
  'dash.byChapter': 'Précision par chapitre',
  'dash.everyChapter': 'Tous les chapitres',
  'dash.belowTarget': 'Les barres rouges sont sous l’objectif de 70 % avant l’examen.',
  'dash.noneAnswered':
    'Aucune réponse pour l’instant. Faites un quiz pour afficher une barre pour chaque chapitre.',
  'dash.noAnswers': 'Pas encore de réponses',
  'dash.needsWork': 'À travailler',
  'dash.onTrack': 'En bonne voie',
  'dash.keepStatus': 'À poursuivre',
  'dash.openFull': 'Ouvrir le tableau de bord complet',
  'dash.jumpBack': 'Reprendre l’étude',
  'dash.threeWays': 'Quatre façons d’étudier.',
  'dash.flashcards': 'Cartes-éclair',
  'dash.freshDeck': 'Commencez un nouveau paquet de trois boîtes',
  'dash.cardDue': '1 carte à revoir aujourd’hui',
  'dash.cardsDueToday': '{n} cartes à revoir aujourd’hui',
  'dash.practiceQuiz': 'Quiz d’exercice',
  'dash.practiceBlurb': 'Dix questions avec réponses au fur et à mesure',
  'dash.session': 'Séance du jour',
  'dash.sessionBlurb': '8 cartes dues, puis 8 questions du chapitre faible',
  'dash.mockExam': 'Examen blanc',
  'dash.mockBlurb': '20 questions · 45:00 · réussite à 15',
  'dash.mockScores': 'Résultats des examens blancs',
  'dash.recentMocks': 'Tentatives récentes, de la plus ancienne à la plus récente.',
  'dash.noMocks': 'Aucun examen blanc. Faites-en un pour commencer à suivre votre préparation.',
  'dash.pass': 'Réussi',
  'dash.below15': 'Sous 15',
  'dash.startMock': 'Commencer un examen blanc',
  'rec.read.title': 'Commencez par le premier chapitre',
  'rec.read.blurb':
    'Lisez Droits et responsabilités, puis les mêmes faits en cartes-éclair. Dix minutes suffisent pour une première séance.',
  'rec.read.cta': 'Lire le chapitre',
  'rec.read.alt': 'Faire un quiz',
  'rec.mock.first': 'Passez votre premier examen blanc',
  'rec.mock.next': 'Passez l’examen blanc n° {n}',
  'rec.mock.blurb':
    '20 questions, 45 minutes, 15 pour réussir — le même format que l’examen. La préparation exige 3 réussites.',
  'rec.mock.cta': 'Commencer l’examen blanc',
  'rec.mock.alt': '10 questions d’exercice',
  'rec.drill.title': 'Travailler {chapter}',
  'rec.drill.blurb':
    'Ce chapitre est à {rate} après {total} réponses, sous les 70 % visés avant l’examen.',
  'rec.drill.cta': 'Quiz de ce chapitre',
  'rec.drill.alt': 'Cartes de ce chapitre',
  'rec.cards.one': '1 carte à revoir',
  'rec.cards.many': '{n} cartes à revoir',
  'rec.cards.blurb': 'Videz la boîte du jour pour respecter l’espacement, puis faites un quiz.',
  'rec.cards.cta': 'Revoir les cartes',
  'rec.cards.alt': 'Quiz',
  'rec.maintain.title': 'Vous tenez le rythme',
  'rec.maintain.blurb':
    'Rien n’est en retard. Gardez la série avec un court ensemble, ou confirmez avec un autre examen blanc.',
  'rec.maintain.cta': 'Quiz',
  'rec.maintain.alt': 'Examen blanc',
  'reason.mock': 'Un examen blanc récent a moins de 15/20.',
  'reason.chapter': '{chapter} est à {rate} % après {total} réponses (il faut 70 %).',
  'chapter.eyebrow': 'Résumé de chapitre',
  'chapter.headOfState': 'Chef de l’État',
  'chapter.gg': 'Gouverneur général',
  'chapter.pm': 'Premier ministre',
  'chapter.speaker': 'Président de la Chambre',
  'chapter.party': 'Parti au pouvoir',
  'chapter.regions': 'Sous-pages régionales',
  'chapters.jump': 'Aller à un chapitre',
  'chapters.all': 'Tous les résumés',
  'chapters.prev': 'Chapitre précédent',
  'chapters.next': 'Chapitre suivant',
  'chapters.eyebrow': 'Découvrir le Canada',
  'chapters.title': 'Résumés de chapitres',
  'chapters.lede':
    'Ces pages sont des notes d’étude originales, pas une copie du guide officiel. Apprenez la forme de chaque sujet, puis entraînez-vous avec les cartes et un quiz.',
  'chapters.ten': 'Les dix chapitres',
  'chapters.tenBlurb': 'Chacun se termine par des liens vers ses cartes et son quiz.',
  'chapters.regionsBlurb':
    'Les examens blancs comprennent des questions sur la province ou le territoire que vous choisissez.',
  'home.chaptersBlurb': 'Notes d’étude originales, puis cartes et quiz pour chacun.',
  'home.dashboard': 'Votre tableau de bord',
  'home.welcome': 'Bon retour, {name}',
  'home.lede':
    'Lisez un chapitre, révisez avec les cartes-éclair, puis passez un examen blanc chronométré. Votre progrès reste sur cet appareil.',
  'home.questions': '{n} questions',
  'home.verified': 'Vérifié le {date}',
  'home.mockHowTitle': 'Fonctionnement des examens blancs',
  'home.mockHowLede':
    'Les examens sont générés au démarrage : ce ne sont pas des questionnaires fixes. Chaque tentative tire 20 questions des 10 chapitres, inclut votre province ou territoire et évite les questions déjà vues tant qu’il en reste de nouvelles.',
  'home.mockTime': '45 minutes',
  'home.mockPass': '15/20 pour réussir',
  'home.mockUnlimited': 'Nouvelles tentatives illimitées',
  'home.mockAdaptive':
    'Les questions manquées ont priorité sans modifier l’équilibre entre les chapitres. Après l’envoi, révisez chaque réponse ou reprenez exactement le même questionnaire.',
  'home.mockCta': 'Commencer un examen blanc',
  'home.installTitle': 'Ajouter l’application à l’écran d’accueil',
  'home.installLede':
    'Étudiez hors ligne et ouvrez le site depuis une icône plutôt que d’un onglet. Après la première visite, il fonctionne sans réseau.',
  'home.installCta': 'Installer l’application',
  'home.installIosCta': 'Comment l’ajouter',
  'home.installIos1': 'Touchez Partager dans Safari (le carré avec une flèche).',
  'home.installIos2': 'Faites défiler et choisissez Sur l’écran d’accueil.',
  'home.installIos3': 'Touchez Ajouter. Ouvrez-la ensuite depuis l’icône.',
  'daily.title': 'Question du jour',
  'daily.lede':
    'Une nouvelle question chaque jour. Elle reste la même si vous revenez plus tard aujourd’hui.',
  'daily.doneHours':
    'Vous avez répondu à la question du jour. Revenez demain (dans {n} heures).',
  'daily.doneHour':
    'Vous avez répondu à la question du jour. Revenez demain (dans 1 heure).',
  'daily.doneMinutes':
    'Vous avez répondu à la question du jour. Revenez demain (dans {n} minutes).',
  'daily.doneMinute':
    'Vous avez répondu à la question du jour. Revenez demain (dans 1 minute).',
  'daily.doneSoon':
    'Vous avez répondu à la question du jour. Revenez demain (dans moins d’une minute).',
  'daily.readChapter': 'Lire {chapter}',
  'faq.title': 'Foire aux questions',
  'faq.lede':
    'Exercices indépendants pour l’examen de citoyenneté canadienne — ce n’est pas l’examen officiel et le site n’est pas affilié à IRCC.',
  'contact.title': 'Encore une question?',
  'contact.lede':
    'Si la FAQ n’a pas répondu, envoyez un message. Le progrès d’étude reste sur cet appareil; seul le texte saisi ici est envoyé par courriel.',
  'contact.name': 'Votre nom',
  'contact.email': 'Courriel',
  'contact.message': 'Message',
  'contact.send': 'Envoyer',
  'contact.sending': 'Envoi…',
  'contact.sent': 'Merci. Le message est en route.',
  'contact.again': 'Envoyer un autre',
  'contact.error': 'Le message n’a pas pu être envoyé. Vérifiez la connexion et réessayez.',
  'faq.footBefore': 'Encore une question? Lisez un',
  'faq.chapter': 'chapitre',
  'faq.try': 'faites un',
  'faq.practice': 'quiz d’exercice',
  'faq.orAdjust': 'ou modifiez les',
  'notFound.title': 'Page introuvable',
  'notFound.lede':
    'Cette adresse ne correspond pas à une page d’étude. Revenez au tableau de bord et choisissez un chapitre.',
  'notFound.back': 'Retour à aujourd’hui',
  'anthem.title': 'Ô Canada',
  'anthem.lede':
    'L’hymne national est à l’examen et à la cérémonie de citoyenneté. Les paroles ci-dessous sont les versions officielles. Les enregistrements sont sur Canada.ca (Orchestre symphonique de Toronto — créditez les artistes si vous les réutilisez).',
  'anthem.listen': 'Écouter sur Canada.ca',
  'anthem.hear': 'Entendre le titre',
  'anthem.english': 'Paroles anglaises',
  'anthem.french': 'Paroles françaises',
  'home.disclaimer': 'Exercice indépendant, pas l’examen officiel',
  'chapter.officialTitle': 'En lire plus',
  'chapter.officialLede':
    'Découvrir le Canada, le guide d’étude officiel, va plus loin sur ce chapitre. Ouvrez-le sur Canada.ca, ou téléchargez le PDF.',
  'chapter.officialCta': 'Lire ce chapitre sur Canada.ca',
  'chapter.officialPdf': 'Découvrir le Canada (PDF)',
  'chapter.print': 'Imprimer ce chapitre',
  'chapter.hear': 'Écouter ce chapitre',
  'search.title': 'Recherche',
  'search.lede':
    'Cherchez une expression dans les notes de chapitre ou dans les questions. Rien ne quitte cet appareil.',
  'search.placeholder': 'Essayez circonscription, Charte ou Yellowknife',
  'search.empty': 'Tapez au moins deux lettres.',
  'search.none': 'Aucun résultat. Essayez un nom propre, ou un mot plus court.',
  'search.chapter': 'Chapitre',
  'search.question': 'Question',
  'search.count': '{n} résultats',
  'glossary.title': 'Lexique',
  'glossary.lede':
    'Courtes définitions des termes que l’examen aime nommer. Chacune renvoie aux notes du chapitre.',
  'glossary.also': 'Aussi appelé',
  'glossary.seeChapter': 'Lire le chapitre',
  'ceremony.title': 'Cérémonie de citoyenneté',
  'ceremony.lede':
    'L’examen n’est pas la dernière étape. À la cérémonie, vous prêtez serment, on s’attend déjà à ce que vous connaissiez les droits et devoirs, et on chante Ô Canada.',
  'ceremony.oathTitle': 'Le serment de citoyenneté',
  'ceremony.oathLede':
    'Vous pouvez jurer ou affirmer solennellement. Le libellé est officiel; cette page le cite pour que vous puissiez le dire à voix haute.',
  'ceremony.swear': 'Je jure',
  'ceremony.affirm': 'J’affirme',
  'ceremony.rightsTitle': 'Droits et responsabilités, en bref',
  'ceremony.rightsLede':
    'Le serment est une promesse d’observer les lois et de remplir vos devoirs. Le premier chapitre en donne la liste complète.',
  'ceremony.source': 'Lire la page officielle de la cérémonie sur Canada.ca',
  'ceremony.openChapter': 'Ouvrir le chapitre',
  'session.title': 'Séance du jour',
  'session.lede':
    'Une boucle courte et chronométrée : jusqu’à huit cartes dues, puis huit questions de votre chapitre le plus faible. Quand la pile est vide, ou au bout de quinze minutes, on s’arrête.',
  'session.cardsPhase': 'Cartes dues',
  'session.quizPhase': 'Quiz du chapitre faible',
  'session.doneTitle': 'Séance terminée',
  'session.doneBlurb':
    'C’est assez pour aujourd’hui. Revenez demain pour ce qui est dû, ou passez un examen blanc pour un test plus long.',
  'session.noCards': 'Aucune carte due',
  'session.timedOut': 'Le temps est écoulé — terminez cet item, puis on s’arrête.',
  'session.time': 'Temps {clock}',
  'session.weakNote': 'Ces huit questions viennent de votre chapitre le plus faible pour l’instant.',
  'session.mixedNote':
    'Pas assez d’historique pour un chapitre faible, alors voici un mélange.',
  'session.cardsRated': '{got} connues ce tour, {learning} encore à apprendre.',
  'session.score': 'Quiz : {score} / {total}.',
  'session.empty': 'Rien n’est dû et il n’y a pas de questions à travailler. Lisez d’abord un chapitre.',
};

const dictionaries: Record<Locale, Dict> = { en, fr };

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'fr';
}

export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
  const table = dictionaries[locale] ?? en;
  let value = table[key] ?? en[key] ?? key;
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
  }
  return value;
}

export function pickLocalized(text: LocalizedText | string, locale: Locale): string {
  if (typeof text === 'string') {
    return text;
  }
  if (locale === 'fr' && text.fr) {
    return text.fr;
  }
  return text.en;
}

export function localizedChapterTitle(id: ChapterId, locale: Locale): string {
  if (locale === 'fr') {
    return CHAPTER_TITLE_FR[id];
  }
  const match = CHAPTERS.find((chapter) => chapter.id === id);
  return match?.title ?? id;
}

export function localizedRegionLabel(code: RegionCode, locale: Locale): string {
  return locale === 'fr' ? REGION_LABELS_FR[code] : REGION_LABELS[code];
}

export function localizedSource(id: ChapterId, locale: Locale): string {
  if (locale === 'fr') {
    return `Découvrir le Canada — ${SOURCE_HEADING_FR[id]}`;
  }
  const match = CHAPTERS.find((chapter) => chapter.id === id);
  return `Discover Canada — ${match?.sourceHeading ?? id}`;
}

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
  const root = document.documentElement;
  const title = locale === 'fr' ? root.dataset.titleFr : root.dataset.titleEn;
  const description =
    locale === 'fr' ? root.dataset.descriptionFr : root.dataset.descriptionEn;
  const ogTitle = locale === 'fr' ? root.dataset.ogTitleFr : root.dataset.ogTitleEn;
  if (title) {
    document.title = title;
  }
  const setMeta = (selector: string, value?: string) => {
    if (value) {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
    }
  };
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[property="og:title"]', ogTitle);
  setMeta('meta[name="twitter:title"]', ogTitle);
  setMeta(
    'meta[property="og:image:alt"]',
    locale === 'fr'
      ? 'Prepare Citizenship — préparation à l’examen de citoyenneté. Gratuit, sans compte et accessible hors ligne.'
      : 'Prepare Citizenship — practice for the citizenship test. Free, no account, works offline.',
  );
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(key, locale);
    }
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) {
      el.setAttribute('aria-label', t(key, locale));
    }
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) {
      el.setAttribute('title', t(key, locale));
    }
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.setAttribute('placeholder', t(key, locale));
    }
  });
}

let speakKeepAlive = 0 as number | 0;
let speakTimers: number[] = [];
let speakGeneration = 0;
let activeSpeakId: string | null = null;
let speakPhase: 'idle' | 'loading' | 'playing' = 'idle';

export type SpeakState = {
  playing: boolean;
  loading: boolean;
  id: string | null;
};

type SpeakListener = (state: SpeakState) => void;
const speakListeners = new Set<SpeakListener>();

function clearSpeakKeepAlive() {
  if (typeof window === 'undefined' || !speakKeepAlive) {
    return;
  }
  window.clearInterval(speakKeepAlive);
  speakKeepAlive = 0;
}

function clearSpeakTimers() {
  if (typeof window === 'undefined') {
    speakTimers = [];
    return;
  }
  for (const timer of speakTimers) {
    window.clearTimeout(timer);
  }
  speakTimers = [];
}

function queueSpeakTimeout(callback: () => void, delay: number) {
  const timer = window.setTimeout(() => {
    speakTimers = speakTimers.filter((id) => id !== timer);
    callback();
  }, delay);
  speakTimers.push(timer);
  return timer;
}

function notifySpeakListeners() {
  const state = getSpeakState();
  for (const listener of speakListeners) {
    listener(state);
  }
}

function setSpeakSession(id: string | null, phase: 'idle' | 'loading' | 'playing') {
  activeSpeakId = id;
  speakPhase = id ? phase : 'idle';
  notifySpeakListeners();
}

/** Chromium drops or stalls long single utterances; keep chunks short. */
function chunkSpeechText(text: string, maxLen = 180): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [];
  }
  if (normalized.length <= maxLen) {
    return [normalized];
  }

  const chunks: string[] = [];
  let remaining = normalized;
  while (remaining.length > maxLen) {
    const slice = remaining.slice(0, maxLen + 1);
    const breakAt = Math.max(
      slice.lastIndexOf('. '),
      slice.lastIndexOf('! '),
      slice.lastIndexOf('? '),
      slice.lastIndexOf('; '),
      slice.lastIndexOf(', '),
      slice.lastIndexOf(' '),
    );
    const cut = breakAt > 40 ? breakAt + 1 : maxLen;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) {
    chunks.push(remaining);
  }
  return chunks;
}

export function canUseSpeech() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getSpeakState(): SpeakState {
  return {
    playing: speakPhase === 'playing',
    loading: speakPhase === 'loading',
    id: activeSpeakId,
  };
}

export function subscribeSpeak(listener: SpeakListener): () => void {
  speakListeners.add(listener);
  listener(getSpeakState());
  return () => {
    speakListeners.delete(listener);
  };
}

export function stopSpeaking() {
  speakGeneration += 1;
  clearSpeakKeepAlive();
  clearSpeakTimers();
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  setSpeakSession(null, 'idle');
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return null;
  }
  const exact = voices.find((voice) => voice.lang === lang);
  if (exact) {
    return exact;
  }
  const prefix = lang.slice(0, 2);
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ?? null;
}

function startSpeaking(text: string, locale: Locale, id: string) {
  if (!canUseSpeech()) {
    return;
  }

  const chunks = chunkSpeechText(text);
  if (chunks.length === 0) {
    return;
  }

  // Invalidate any prior session callbacks before starting a new one.
  speakGeneration += 1;
  const generation = speakGeneration;
  clearSpeakKeepAlive();
  clearSpeakTimers();
  // Only cancel when something is already queued; bare cancel()+speak races in Chromium.
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  const lang = locale === 'fr' ? 'fr-CA' : 'en-CA';
  const voice = pickVoice(lang);
  const startedAt = Date.now();
  const minLoadingMs = 400;
  let index = 0;
  let started = false;
  let retried = false;

  const stillCurrent = () => generation === speakGeneration && activeSpeakId === id;

  const markPlaying = () => {
    if (!stillCurrent() || started) {
      return;
    }
    started = true;
    const wait = Math.max(0, minLoadingMs - (Date.now() - startedAt));
    queueSpeakTimeout(() => {
      if (stillCurrent()) {
        setSpeakSession(id, 'playing');
      }
    }, wait);
  };

  const speakNext = () => {
    if (!stillCurrent()) {
      return;
    }
    if (index >= chunks.length) {
      clearSpeakKeepAlive();
      clearSpeakTimers();
      setSpeakSession(null, 'idle');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = lang;
    if (voice) {
      utterance.voice = voice;
    }
    const chunkIndex = index;
    index += 1;

    if (chunkIndex === 0) {
      utterance.onstart = () => {
        if (stillCurrent()) {
          markPlaying();
        }
      };
    }

    utterance.onend = () => {
      if (!stillCurrent()) {
        return;
      }
      if (index >= chunks.length) {
        clearSpeakKeepAlive();
        clearSpeakTimers();
        setSpeakSession(null, 'idle');
        return;
      }
      speakNext();
    };

    utterance.onerror = (event) => {
      // cancel() before a new speak() often reports interrupted/canceled.
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }
      if (stillCurrent()) {
        clearSpeakKeepAlive();
        clearSpeakTimers();
        setSpeakSession(null, 'idle');
      }
    };

    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.resume();
  };

  // Mark loading immediately so the spinner can paint before onstart.
  setSpeakSession(id, 'loading');
  // Kick the voice list; some engines are silent until this runs once.
  window.speechSynthesis.getVoices();
  // First speak() stays in the click turn so iOS keeps the user-gesture unlock.
  speakNext();

  // If Chromium swallowed the first utterance, retry once while still loading.
  queueSpeakTimeout(() => {
    if (!stillCurrent() || started || retried) {
      return;
    }
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      markPlaying();
      return;
    }
    retried = true;
    index = 0;
    speakNext();
  }, 700);

  // Chromium can silently pause mid-queue on longer readings.
  speakKeepAlive = window.setInterval(() => {
    if (!stillCurrent()) {
      clearSpeakKeepAlive();
      return;
    }
    if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
      clearSpeakKeepAlive();
      clearSpeakTimers();
      setSpeakSession(null, 'idle');
      return;
    }
    window.speechSynthesis.resume();
  }, 5000);
}

/** Start speaking, or stop if this same id is already active (loading or playing). */
export function toggleSpeak(text: string, locale: Locale, id: string): boolean {
  if (!canUseSpeech()) {
    return false;
  }
  if (activeSpeakId === id) {
    stopSpeaking();
    return false;
  }
  startSpeaking(text, locale, id);
  return true;
}

/** @deprecated Prefer toggleSpeak — kept for call sites that always want a fresh start. */
export function speakText(text: string, locale: Locale, id = 'default') {
  startSpeaking(text, locale, id);
}
