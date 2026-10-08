/* Shared pieces for exam-style questions: one part with its marks, answer and markscheme. */
import {F,fstr} from '../../../helpers/fractions.js';
import {TYPES} from '../question-list.js';

/* lesson: a question of one of the topic's question types; "Show me the working" opens its worked solution,
   and unless an answer is given, the part's answer is that question type's answer */
export const part=({text,marks,answer,scheme,lesson})=>({text,marks,scheme,lesson,answer:answer||TYPES[lesson.t].ans(lesson)});
/* an exact number answer */
export const num=v=>{const f=typeof v==='object'?v:F(v);return {kind:'num',val:f,disp:fstr(f).replace('-','−')}};
/* a number for working-out lines, in brackets when negative: 2 × (−3) */
export const par=v=>String(v).startsWith('-')?`(${String(v).replace('-','−')})`:String(v);
