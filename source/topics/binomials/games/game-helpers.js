/* Shared helpers for building revision-game questions. */
import {shuffle} from '../../../helpers/random-numbers.js';

/* a multiple-choice question: the right answer plus up to three different wrong ones, shuffled */
export const mcq=(q,correct,wrongs,why)=>{const opts=shuffle([correct,...[...new Set(wrongs)].filter(w=>w!==correct).slice(0,3)]);return {q,type:'mc',opts,ans:opts.indexOf(correct),why}};
/* a question answered on the number pad (fractions like 3/8 are fine) */
export const typed=(q,answer,why)=>({q,type:'num',answer:String(answer),why});
/* choose a value for the current level: 1 easy, 2 medium, 3 hard */
export const byLevel=(level,easy,medium,hard)=>level<=1?easy:level===2?medium:hard;
