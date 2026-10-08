/* App-wide settings: question groups, difficulty levels, tabs, timings and storage keys. */

const GROUPS=[['expand','Expanding brackets'],['find','Finding terms and coefficients'],['unknown','Unknowns and estimates'],['other','Other skills']];
const LEVELS=[[1,'Easy'],[2,'Medium'],[3,'Hard']];
const TABS=['learn','practice','revise','cheat'];
/* milliseconds per handwritten character, indexed by the Speed slider (1 = slow … 3 = fast) */
const WRITE_SPEED_MS=[0,70,38,16];
/* length of a revision game, in seconds */
const GAME_SECONDS=45;
/* localStorage key prefix for best game scores */
const BEST_SCORE_KEY='bin_best_';
/* one-line descriptions under each Learn folder */
const GROUP_DESCRIPTIONS={expand:'Multiplying out brackets with a power',find:'Coefficients, the constant term, a particular term and more',
  unknown:'Finding k or n, estimates, negative and fractional powers',other:'nCr, and expanding with letters'};
export {GROUPS,LEVELS,TABS,WRITE_SPEED_MS,GAME_SECONDS,BEST_SCORE_KEY,GROUP_DESCRIPTIONS};
