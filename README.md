# Prepare Citizenship

A static study site for the Canadian citizenship test: original chapter summaries, flashcards, practice quizzes, and a 20-question mock exam. Progress stays on the device. After the first load it works offline.

**Study here:** [milon.im/prepare-citizenship](https://milon.im/prepare-citizenship/)

This project is not affiliated with Immigration, Refugees and Citizenship Canada. Questions are original paraphrases for practice, not the real test bank. For the official material, use *[Discover Canada](https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/test/study.html)* or the [PDF](https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover.pdf).


## Develop

Requires Node 22.12 or newer.

```sh
npm install
npm run dev
```

```sh
npm run build     # validates the question bank, type-checks, then builds
npm run preview   # serves `dist/` (needed to try the service worker)
```

GitHub Pages builds with `base` set to `/prepare-citizenship/`. Local `dev` and `preview` use `/`.

## Content

| Path                       | What it is                                                    |
|----------------------------|---------------------------------------------------------------|
| `src/content/questions/`   | One JSON file per chapter                                     |
| `src/content/chapters/`    | Original summaries (Markdown)                                 |
| `src/content/current.json` | Office-holders (`lastVerified`, PM, GG, Head of State, party) |
| `src/content/flashcards/`  | Extra recall cards that are a poor fit as MCQs                |

Questions that name current officials use `{{primeMinister}}`-style tokens and a `currentFactKey` instead of hard-coding names. Update `current.json` when those offices change, then bump `lastVerified`.

`npm run validate:content` checks unique ids, option shapes, exactly one correct option, explanations, chapters, and sources. It also runs as part of `npm run build`.

## Privacy

No accounts, no analytics, no backend. Progress never leaves the browser unless the user exports it.

## License

Site code is in this repository. *Discover Canada* remains Crown copyright; this project does not reproduce that text.
