/* Revision game: Like-term sums. Add two like terms. */
import {mono,sg,xp} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {byLevel,typed} from './game-helpers.js';

export const game={id:'like',syllabus:'SL 1.9',name:'Like-term sums',icon:'➕',skill:'Collecting like terms',
  how:'Add the two terms. Type just the number in front.',
  next(level){const e=ri(0,6),lim=byLevel(level,9,20,50);const p=level<2?ri(1,lim):rnz(-lim,lim),q=level<2?ri(1,lim):rnz(-lim,lim);
    const show=v=>v<0?'('+mono(BigInt(v),e,true)+')':mono(BigInt(v),e,true);
    return typed(`${mono(BigInt(p),e,true)} + ${show(q)} = ? <span class="mu g-small">(just the number)</span>`,p+q,`${sg(p)} + ${sg(q)} = ${sg(p+q)}, and the ${xp(e)||'(no x)'} stays.`)}};
