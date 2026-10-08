# Working on Infinity Maths

Edit files in `source/`. Never edit the root `index.html`: it is built. After a change, run `npm run build` and commit `index.html` along with the change.

## Make a new file whenever one is needed

Don't grow a file when the new code is a separate thing. Make a new file for it:

- **A new question type** gets its own file in `source/topics/<topic>/question-types/<group>/`, plus one import line in `source/topics/<topic>/<topic>.js`. The import order is the order the types appear in the app.
- **A new revision game** gets its own file in `source/topics/<topic>/games/`, listed in `game-list.js`.
- **A new exam-style question** gets its own file in `source/topics/<topic>/exam-questions/`, listed in `exam-list.js`.
- **A new screen or tab** gets its own file in `source/screens/`, exporting an `init…()` function that `source/start.js` calls.
- **A new topic** gets its own folder, `source/topics/<topic>/`, laid out like `binomials/`, with a `topic` object in `<topic>.js`, and one line in `source/topics/topic-list.js`.
- **New styles for a new screen** go in their own `source/styles/<screen>.css`, added to `styles/all-styles.css` at the right point in the cascade.
- **A new helper used by several files** goes in `source/helpers/`. Code used by one file only stays in that file.
- **A new setting** (a number, name or timing someone might want to change) goes in `source/settings.js`.
- **Split a file** when it passes about 150 lines or starts doing more than one job. Name each piece for what it holds.

## Names and links

- Folders and files have plain-English, lowercase-with-dashes names that say what they hold, e.g. `screens/practice-tab.js`, `question-types/finding-terms/middle-term.js`.
- Imports only point one way: `screens/` → `notebook/` and `topics/` → `worked-solutions/` → `maths/` → `helpers/`. The notebook uses only `helpers/` and `settings.js`. Never make two files import each other.
- Every file starts with a one-line comment saying what it is for.
- When you add, split or rename a file, update the "What is where" map in `README.md`.
- Every question type, game and exam question has a `syllabus` tag: one section for every course (`'SL 1.9'`, or `'AHL 1.10'` for HL-only), or one per course family when they differ (`{aa:'SL 2.5', ai:'AHL 2.7'}`; leave a family out if the course doesn't have it). Screens filter with `inCourse` from `screens/study-settings.js`. Markup that is HL-only or for one paper gets the class `hl-only`, `paper-1-only` or `paper-2-only`; markup for only some courses gets `data-only="aa-sl aa-hl ai-hl"`.
- Every topic's `topic` object lists its `courses` (`ai-sl`, `ai-hl`, `aa-sl`, `aa-hl`), so the home screen shows only the topics in the course the student chose.
- The app is for IB DP students, but it is independent: never use the IB logo or call content official or past-paper material. Keep the disclaimer in the footer.
- Every box the learner types maths into gets `data-maths="integer|number|poly|expr|letters|func|line|ineq|list"`, which brings up the maths keyboard with the right keys (answer boxes made by `screens/answer-boxes.js` choose it for you). Typed numbers are read with `readNumber`/`sameNum` from `helpers/reading-input.js`, which understand √, powers and fractions.
- Answers are made with `maths/making-answers.js` (exact, 3 s.f., lists, points, expressions, lines, inequalities, several boxes) and marked by `maths/checking-answers.js`. The answer shown to the learner must be accepted when typed in.
