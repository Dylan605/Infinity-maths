/* The binomial topic. Each import below adds one question type to TYPES; this order is the order they appear in the app. */

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

export {TYPES,genQ} from './question-list.js';
export {GAMES} from './game-questions.js';
