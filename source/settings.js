/* App-wide settings: difficulty levels, tabs, courses, timings and storage keys. Each topic's own folders are in its topic file. */

const LEVELS=[[1,'Easy'],[2,'Medium'],[3,'Hard']];
const TABS=['learn','practice','exam','revise','cheat'];
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
/* the IB courses and papers you can study for, and where the choice is remembered */
/* [code, short name, course, level]; topics list the course codes they belong to */
const COURSES=[['ai-sl','AI SL','Applications and interpretation','Standard level'],['ai-hl','AI HL','Applications and interpretation','Higher level'],
  ['aa-sl','AA SL','Analysis and approaches','Standard level'],['aa-hl','AA HL','Analysis and approaches','Higher level']];
const PAPERS=[['1','Paper 1','no calculator'],['2','Paper 2','calculator']];
const COURSE_KEY='infinity_course';
const PAPER_KEY='infinity_paper';
/* true: ask which course every time the app opens (the last choice is highlighted); false: ask only the first time */
const ASK_COURSE_EVERY_TIME=true;
/* rough exam timing, used to suggest how long an exam-style question should take */
const EXAM_MINUTES_PER_MARK=1.1;
/* how many past calculations the calculator keeps in its history */
const CALC_HISTORY_SIZE=8;
/* localStorage key prefix for best game scores, and the key for the sound on/off switch */
const BEST_SCORE_KEY='bin_best_';
const SOUND_KEY='infinity_sound';
export {LEVELS,TABS,EXAM_MINUTES_PER_MARK,COURSES,PAPERS,COURSE_KEY,PAPER_KEY,ASK_COURSE_EVERY_TIME,WRITE_SPEED_MS,BEST_SCORE_KEY,SOUND_KEY,CALC_HISTORY_SIZE,
  GAME_SECONDS,GAME_LIVES,GAME_POINTS,GAME_COMBO_EVERY,GAME_MAX_COMBO,GAME_COMBO_BONUS_SECONDS,GAME_BOARD_BONUS_SECONDS,GAME_LEVEL_UP_EVERY,GAME_STARS};
