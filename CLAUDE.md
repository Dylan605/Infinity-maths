# Working on Infinity Maths

Edit files in `source/`. Never edit the root `index.html`: it is built. After a change, run `npm run build` and commit `index.html` along with the change.

## Make a new file whenever one is needed

Don't grow a file when the new code is a separate thing. Make a new file for it:

- **A new question type** gets its own file in `source/topics/<topic>/question-types/<group>/`, plus one import line in `source/topics/<topic>/<topic>.js`. The import order is the order the types appear in the app.
- **A new revision game** gets its own file in `source/topics/<topic>/games/`, listed in `game-list.js`.
- **A new screen or tab** gets its own file in `source/screens/`, exporting an `init…()` function that `source/start.js` calls.
- **A new topic** gets its own folder, `source/topics/<topic>/`, laid out like `binomials/`.
- **New styles for a new screen** go in their own `source/styles/<screen>.css`, added to `styles/all-styles.css` at the right point in the cascade.
- **A new helper used by several files** goes in `source/helpers/`. Code used by one file only stays in that file.
- **A new setting** (a number, name or timing someone might want to change) goes in `source/settings.js`.
- **Split a file** when it passes about 150 lines or starts doing more than one job. Name each piece for what it holds.

## Names and links

- Folders and files have plain-English, lowercase-with-dashes names that say what they hold, e.g. `screens/practice-tab.js`, `question-types/finding-terms/middle-term.js`.
- Imports only point one way: `screens/` → `notebook/` and `topics/` → `worked-solutions/` → `maths/` → `helpers/`. The notebook uses only `helpers/` and `settings.js`. Never make two files import each other.
- Every file starts with a one-line comment saying what it is for.
- When you add, split or rename a file, update the "What is where" map in `README.md`.
- Every box the learner types maths into gets `data-maths="integer|number|poly|expr|letters"`, which brings up the maths keyboard with the right keys. Typed numbers are read with `readNumber`/`sameNum` from `helpers/reading-input.js`, which understand √, powers and fractions.
