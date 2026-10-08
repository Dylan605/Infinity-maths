/* App-wide settings: question groups, difficulty levels, tabs, timings and storage keys. */

const GROUPS=[['expand','Expanding brackets'],['find','Finding terms and coefficients'],['unknown','Unknowns and estimates'],['other','Other skills']];
const LEVELS=[[1,'Easy'],[2,'Medium'],[3,'Hard']];
const TABS=['learn','practice','revise','cheat'];
/* milliseconds per handwritten character, indexed by the Speed slider (1 = slow … 3 = fast) */
const WRITE_SPEED_MS=[0,70,38,16];
/* revision games: length of a round in seconds, and lives (wrong answers allowed) */
const GAME_SECONDS=45;
const GAME_LIVES=3;
/* points for a right answer, before the combo multiplier */
const GAME_POINTS=10;
/* every GAME_COMBO_EVERY right answers in a row adds ×1 to the multiplier, up to GAME_MAX_COMBO, and gives bonus seconds */
const GAME_COMBO_EVERY=3;
const GAME_MAX_COMBO=4;
const GAME_COMBO_BONUS_SECONDS=3;
/* seconds added for clearing a Match up board */
const GAME_BOARD_BONUS_SECONDS=5;
/* right answers needed for each level up (levels go from 1 to 3) */
const GAME_LEVEL_UP_EVERY=6;
/* scores needed for 1, 2 and 3 stars */
const GAME_STARS=[60,180,360];
/* how many past calculations the calculator keeps in its history */
const CALC_HISTORY_SIZE=8;
/* localStorage key prefix for best game scores, and the key for the sound on/off switch */
const BEST_SCORE_KEY='bin_best_';
const SOUND_KEY='infinity_sound';
/* one-line descriptions under each Learn folder */
const GROUP_DESCRIPTIONS={expand:'Multiplying out brackets with a power',find:'Coefficients, the constant term, a particular term and more',
  unknown:'Finding k or n, estimates, negative and fractional powers',other:'nCr, and expanding with letters'};
export {GROUPS,LEVELS,TABS,WRITE_SPEED_MS,GROUP_DESCRIPTIONS,BEST_SCORE_KEY,SOUND_KEY,CALC_HISTORY_SIZE,
  GAME_SECONDS,GAME_LIVES,GAME_POINTS,GAME_COMBO_EVERY,GAME_MAX_COMBO,GAME_COMBO_BONUS_SECONDS,GAME_BOARD_BONUS_SECONDS,GAME_LEVEL_UP_EVERY,GAME_STARS};
