/* The binomial topic: what it covers, and everything in it. Each question-type import adds one type to TYPES; this order is the order they appear in the app. */
import {TYPES,genQ} from './question-list.js';
import {GAMES} from './games/game-list.js';
import {EXAMS} from './exam-questions/exam-list.js';
import {CHEAT_SHEET} from './cheat-sheet.js';

/* Expanding brackets */
import './question-types/expanding-brackets/expand-and-simplify.js';
import './question-types/expanding-brackets/first-three-and-last-two-terms.js';

/* Finding terms and coefficients */
import './question-types/finding-terms/coefficient-of-a-power-of-x.js';
import './question-types/finding-terms/constant-term.js';
import './question-types/finding-terms/coefficient-in-a-product.js';
import './question-types/finding-terms/a-particular-term.js';
import './question-types/finding-terms/middle-term.js';
import './question-types/finding-terms/ascending-powers.js';
import './question-types/finding-terms/sum-of-the-coefficients.js';
import './question-types/finding-terms/greatest-coefficient.js';

/* Unknowns and estimates */
import './question-types/unknowns-and-estimates/find-k-from-a-coefficient.js';
import './question-types/unknowns-and-estimates/find-k-when-coefficients-are-equal.js';
import './question-types/unknowns-and-estimates/find-n-from-a-coefficient.js';
import './question-types/unknowns-and-estimates/estimate-a-number.js';
import './question-types/unknowns-and-estimates/negative-or-fractional-power.js';

/* Other skills */
import './question-types/other-skills/evaluate-ncr.js';
import './question-types/other-skills/solve-ncr-for-n.js';
import './question-types/other-skills/expand-with-letters.js';

/* courses: the course codes the topic is in. grades: the year(s) it is usually taught in (11, 12). sections: its syllabus sections for each course family (aa, ai).
   groups: [id, folder name, one-line description], one Learn folder each. keys: extra words the topic search finds. */
export const topic={id:'binomial',name:'Binomials',courses:['aa-sl','aa-hl'],grades:[11],sections:{aa:'SL 1.9 · AHL 1.10'},
  desc:"Expansion, Pascal's triangle, nCr, coefficients, terms, unknowns, estimates, and negative or fractional powers (HL)",
  keys:'binomial binomials binomial expansion expand expansion pascal pascals triangle ncr combinations choose algebra powers brackets series coefficient constant term independent of x middle term ascending powers approximation estimate negative fractional power sum of coefficients greatest coefficient unknown k find n factorial theorem',
  groups:[['expand','Expanding brackets','Multiplying out brackets with a power'],['find','Finding terms and coefficients','Coefficients, the constant term, a particular term and more'],
    ['unknown','Unknowns and estimates','Finding k or n, estimates, negative and fractional powers'],['other','Other skills','nCr, and expanding with letters']],
  types:TYPES,genQ,games:GAMES,exams:EXAMS,cheatSheet:CHEAT_SHEET};
export {TYPES,genQ};
