/* Shared pieces for Functions exam-style questions: one part with its marks, answer and markscheme. */
import {TYPES} from '../question-list.js';

/* lesson: a question of one of the topic's question types; "Show me the working" opens its worked solution,
   and unless an answer is given, the part's answer is that question type's answer */
export const part=({text,marks,answer,scheme,lesson})=>({text,marks,scheme,lesson,answer:answer||TYPES[lesson.t].ans(lesson)});
