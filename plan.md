# Canadian Citizenship Test Prep — Requirements & Work Breakdown

Final v1 plan. Implement against this document; do not reopen closed decisions without an explicit change.

## 1. Project overview

A static website to help someone study for the Canadian citizenship test, featuring
flashcards and quizzes, deployed for free on GitHub Pages, usable fully offline once
loaded.

**Goals**
- Cover all official *Discover Canada* study guide chapters (paraphrased, not copied)
- Let the user self-assess readiness via a realistic mock exam
- Track progress across study sessions without requiring a login or backend
- Work well on mobile (likely primary study device)

**Non-goals (for v1)**
- User accounts / login
- Cross-device sync without manual export/import
- Server-side anything
- French UI/content (schema is bilingual-ready; strings ship in v2)
- Public comments on questions
- Matching commercial apps' 600–1,400 question marketing counts
- Custom domain at first launch (GitHub project URL first)
- IndexedDB

---

## 2. Functional requirements

### 2.1 Content
- [ ] Organize by official *Discover Canada* chapters:
      Rights and Responsibilities; Who We Are; Canada's History; Modern Canada;
      How Canadians Govern Themselves; Federal Elections; The Justice System;
      Canadian Symbols; Canada's Economy; Canada's Regions (Atlantic, Central,
      Prairie, West Coast, Northern Territories)
- [ ] Short original study-guide summary page per chapter (not raw Q&A, not
      verbatim Crown-copyright text from the guide)
- [ ] Question bank as structured JSON under `src/content/questions/` (one file
      per chapter), not hardcoded in pages
- [ ] **~300–400 unique questions.** Later: 500–600 via alternate phrasings of
      the same facts. Do not pad with near-duplicates for a headline number.
- [ ] Mix of **multiple-choice (4 options)** and **true/false**
- [ ] Regional items tagged by province/territory (`ab`, `bc`, `mb`, `nb`, `nl`,
      `ns`, `nt`, `nu`, `on`, `pe`, `qc`, `sk`, `yt`); national items have
      `"region": null`. Province picker + regional mock items are **v1**
- [ ] Stale facts (PM, Governor General, party in power, Speaker, etc.) live in
      `src/content/current.json` with a `lastVerified` date; questions reference
      those keys instead of baking names into stems
- [ ] Every question cites `chapter` + source location in *Discover Canada*
- [ ] Homepage disclaimer: not affiliated with IRCC; link the official guide PDF;
      this is practice, not the real question bank

### 2.2 Flashcards
- [ ] Flip-card UI (prompt front / answer + short explanation back)
- [ ] Most cards **derived from the question bank**. Extra recall-only cards only
      for lists/dates that make poor MCQs
- [ ] Leitner, 3 boxes: learning / reviewing / known
- [ ] Due scheduling (not boxes alone):
      - Box 1 (learning): due next session / next calendar day
      - Box 2 (reviewing): due in 3 days
      - Box 3 (known): due in 7 days
      - Wrong answer or "still learning" → box 1, due immediately
- [ ] "Mark as known / still learning" manual override
- [ ] Filter by chapter; shuffle; "review only mistakes" (cards the user got
      wrong in practice or mocks)
- [ ] Leitner box / due date live in progress state only, never in content files

### 2.3 Practice quiz
- [ ] Untimed, immediate feedback + explanation per question
- [ ] Filterable by chapter; "practice my weakest chapter"
- [ ] Randomized question order and randomized option order per attempt

### 2.4 Mock exam
- [ ] Always **20 questions**, **45 minutes**, pass at **15/20**. Unlimited
      attempts; length is not configurable
- [ ] Topic-balanced draw across chapters (not 20 random items from one pile)
- [ ] Include regional questions for the user's selected province/territory
- [ ] Mix MC and true/false
- [ ] Anti-repeat: do not reuse a question from the **last 3 mocks** unless the
      eligible pool is too small
- [ ] During the attempt: no answers until submit; flag-for-review; jump between
      questions; no pause; 5-minute warning; auto-submit at 0:00
- [ ] End-of-exam review: correct/incorrect, explanations, chapter breakdown

### 2.5 Progress tracking
- [ ] Persist quiz history, flashcard box/due state, mock scores, settings, and
      selected province in `localStorage` with `schemaVersion: 1`
- [ ] Dashboard: overall accuracy, per-chapter accuracy, mock score trend,
      streak, **readiness** (rule in §7)
- [ ] Show `current.json` last-verified date ("officials last checked …")
- [ ] Export / import progress as JSON; warn before import overwrites
- [ ] Reset progress
- [ ] After the PWA is installed, request `navigator.storage.persist()`
- [ ] If `localStorage` is missing (private mode) or a write fails, show a
      clear “progress won’t save” banner — do not fail silently

### 2.6 Accessibility & UX
- [ ] Mobile-first; large tap targets (~44px)
- [ ] Dark mode; adjustable font size; `prefers-reduced-motion` on card flip
- [ ] Keyboard-navigable quiz/flashcard controls
- [ ] Do not rely on colour alone for correct/incorrect
- [ ] First-run: choose province/territory before study tools (can change later
      in settings)
- [ ] Home study path: chapter summary → flashcards → chapter quiz → mock
- [ ] Screen-reader-friendly flip cards (state announced)

### 2.7 Offline / PWA
- [ ] Web app manifest (installable on mobile home screen), including
      `apple-touch-icon`
- [ ] Service worker caching all content/assets for full offline use
- [ ] Works with zero network after first load
- [ ] v1 ships as a GitHub Pages **project site** (`base` = `/prepare-citizenship/`). Design
      so a later custom-domain move (root `base`) is a config change, not a rewrite
- [ ] Test iOS Safari standalone / home-screen mode and `localStorage` behaviour

### 2.8 Post-v1 (out of scope until v1 ships)
- [ ] Fill `fr` strings + language toggle
- [ ] Audio for "O Canada" / key term pronunciation
- [ ] Print-friendly flashcard view
- [ ] "Report a mistake" via GitHub issue template
- [ ] Alternate phrasings toward ~500–600 items if mocks start repeating
- [ ] Custom domain `preparecitizenshiptest.com`

---

## 3. Non-functional requirements

- **Performance:** initial load under ~2s on 4G; all interactive logic client-side
- **Hosting cost:** $0 (GitHub Pages free tier)
- **Browser support:** last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari
  (mobile is primary use case)
- **Maintainability:** add/edit JSON to grow the bank; no code changes required
- **Content integrity:** CI validates unique ids, type/options constraints, exactly
  one correct option, explanation, chapter, source
- **Persistence:** `localStorage` for the versioned progress blob (expected well
  under 1MB). IndexedDB is not used in v1. Question bank stays in the app bundle
  / SW cache. iOS can evict either API; mitigation is install-as-PWA + `persist()`,
  plus a failure banner
- **Privacy:** no PII, no analytics in v1
- **Legal:** original paraphrases only; Crown copyright of *Discover Canada* is
  not reproduced; third-party-bank warning is shown to users

---

## 4. Tech stack

| Layer           | Choice                         | Why                                                                                                                      |
|-----------------|--------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Site generator  | Astro                          | Zero-JS by default, islands for quiz/flashcard/dashboard, content collections for schema-checked data                    |
| Interactivity   | Alpine.js inside Astro islands | Only where needed. If mock state (flag, nav, timer, autosubmit) gets messy, a small Preact island is an allowed fallback |
| Data            | JSON under `src/content/`      | Structured, git-diffable; questions per chapter + `current.json`                                                         |
| Persistence     | `localStorage`                 | Versioned JSON blob; tiny; sync; Alpine-friendly                                                                         |
| Offline         | `vite-plugin-pwa`              | Service worker + manifest                                                                                                |
| Hosting         | GitHub Pages (project site)    | Free; custom domain later                                                                                                |
| CI/CD           | GitHub Actions                 | Build → deploy on push to `main`; fail on invalid question JSON                                                          |
| Mistake reports | GitHub issue template (v2)     | No server, no public comment threads on items                                                                            |

---

## 5. Data schema

Bilingual fields exist from day one (`en` required, `fr` omitted or null until v2).
Correctness is an option `id`, not an array index. Runtime Leitner state is not
stored on content records.

### Question
```json
{
  "id": "gov-014",
  "chapter": "how-canadians-govern-themselves",
  "region": null,
  "type": "mcq",
  "difficulty": "core",
  "prompt": {
    "en": "Who is the Head of State in Canada?"
  },
  "options": [
    { "id": "a", "en": "The Prime Minister" },
    { "id": "b", "en": "The Governor General" },
    { "id": "c", "en": "The Monarch" },
    { "id": "d", "en": "The Chief Justice" }
  ],
  "correctOptionId": "c",
  "explanation": {
    "en": "Canada is a constitutional monarchy; the Monarch is Head of State, represented in Canada by the Governor General."
  },
  "source": "Discover Canada — How Canadians Govern Themselves"
}
```

- `type: "true_false"` uses two options with ids `true` and `false`
- Regional items set `"region"` to a province/territory code above
- Office-holder items reference keys in `current.json`

Allowed `chapter` values:

`rights-and-responsibilities` · `who-we-are` · `canadas-history` ·
`modern-canada` · `how-canadians-govern-themselves` · `federal-elections` ·
`the-justice-system` · `canadian-symbols` · `canadas-economy` ·
`canadas-regions`

### Extra flashcard (optional; most cards are derived)
```json
{
  "id": "sym-003",
  "chapter": "canadian-symbols",
  "front": { "en": "What is Canada's national animal?" },
  "back": { "en": "The beaver" },
  "source": "Discover Canada — Canadian Symbols"
}
```

### Current officials (`src/content/current.json`)
```json
{
  "lastVerified": "2026-09-13",
  "headOfState": "The Monarch",
  "governorGeneral": "",
  "primeMinister": "",
  "partyInPower": ""
}
```

### Progress record (`localStorage`)
```json
{
  "schemaVersion": 1,
  "province": "on",
  "quizAttempts": [
    {
      "date": "2026-09-13",
      "mode": "mock",
      "score": 17,
      "total": 20,
      "questionIds": ["gov-014"]
    }
  ],
  "flashcardState": {
    "gov-014": { "box": 2, "due": "2026-09-15", "lastSeen": "2026-09-13" }
  },
  "chapterAccuracy": {
    "how-canadians-govern-themselves": 0.82,
    "canadas-history": 0.65
  }
}
```

`chapterAccuracy` may be derived at read time from attempts rather than stored;
if stored, it must be rebuilt after import.

---

## 6. Work breakdown

### Phase 0 — Setup
- [x] Initialize Astro project (`prepare-citizenship`) and GitHub Actions Pages
      **project-site** deploy (`base` = `/prepare-citizenship/` on GitHub Pages)
- [x] Confirm the placeholder builds locally with GitHub Actions project-site
      environment variables. Live URL confirmation happens after the first push
      to `milon/prepare-citizenship`.

### Phase 1 — Schema and gold-standard content
- [ ] Define Zod / content-collection schema (questions, extra cards, `current.json`)
- [ ] CI check: unique ids, MC vs T/F shape, `correctOptionId` exists, explanation,
      chapter, source
- [ ] Write ~30 gold-standard questions across chapters (including T/F + one
      regional example)
- [ ] Scale to ~300–400 unique items; extra flashcards only where needed
- [ ] Write original chapter summary pages (10 chapters + region subpages)
- [ ] Fill `current.json` and date-stamp it

### Phase 2 — Core features
- [ ] Province picker (first run + settings)
- [ ] Flashcards: flip UI, due-based Leitner, shuffle, chapter filter
- [ ] Practice quiz: immediate feedback, weakest-chapter mode
- [ ] Mock exam: 20 / 45:00 / 15 pass, balanced draw, last-3 anti-repeat, flag,
      no pause, autosubmit
- [ ] Results/review + chapter breakdown

### Phase 3 — Progress and persistence
- [ ] Versioned `localStorage` layer (province, attempts, Leitner, settings)
- [ ] Quota / private-mode failure banner
- [ ] Dashboard: accuracy, trend, streaks, readiness (§7)
- [ ] Export / import / reset
- [ ] `navigator.storage.persist()` after home-screen install

### Phase 4 — Polish
- [ ] Responsive/mobile pass
- [ ] Dark mode + font size + reduced motion
- [ ] Accessibility pass (keyboard, contrast, ARIA, no colour-only feedback)
- [ ] Disclaimer + official guide link on home

### Phase 5 — Offline / PWA
- [ ] Manifest + icons (including Apple touch icon)
- [ ] Service worker via `vite-plugin-pwa` (correct project-site scope)
- [ ] Test full offline after first load; iOS home-screen

### Phase 6 — Launch
- [ ] Content audit against current *Discover Canada* + `current.json`
- [ ] Cross-browser/device testing (especially iOS Safari)
- [ ] Ship on GitHub project URL. Custom domain is post-v1

### Phase 7 — Post-v1
- [ ] Custom domain `preparecitizenshiptest.com` (`base` → `/`)
- [ ] Fill `fr` strings + language toggle
- [ ] Audio clips
- [ ] Print-friendly flashcards
- [ ] GitHub issue template for content mistakes
- [ ] Alternate phrasings toward ~500–600 items if mocks start repeating

---

## 7. Closed decisions

- **Question bank:** ~300–400 unique v1 items; quality over marketing count
- **Mock exam:** always 20 questions, 45 minutes, 15 to pass; unlimited attempts
- **Anti-repeat:** last 3 mocks
- **Bilingual:** schema now, French UI/content in v2
- **Launch URL:** GitHub Pages project site
      `https://milon.github.io/prepare-citizenship/` first; custom domain later
- **Comments:** no giscus; mistake reports via GitHub issues in v2
- **Analytics:** none in v1
- **Province/territory:** v1 — required on first run; mocks include that region
- **Client storage:** `localStorage` for v1, not IndexedDB
- **Readiness (v1):**
  - **Not enough data** until the user has completed **3 mocks**
  - **Ready** when (a) the last 3 mocks each scored ≥15/20 **and** (b) every
    chapter with at least **10** recorded answers (practice + mock) is ≥70%
    accurate. Chapters with fewer than 10 answers do not block Ready; they show
    as “keep practicing”
  - **Not ready** otherwise, with the blocking reason listed (failed recent mock
    and/or named weak chapters)
  - A 20-question test is noisy; three passing mocks plus a 10-answer floor
    avoids calling someone ready after one lucky sitting or one unlucky chapter
    with three questions
