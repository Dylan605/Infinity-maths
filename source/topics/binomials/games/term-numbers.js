/* Revision game: Term numbers. Link term numbers, r and the number of terms. */
import {ord} from '../../../helpers/maths-display.js';
import {ri} from '../../../helpers/random-numbers.js';
import {byLevel,mcq} from './game-helpers.js';

export const game={id:'termname',syllabus:'SL 1.9',name:'Term numbers',icon:'🔢',skill:'Which term is which',
  how:'The (r+1)th term uses r, and there is always one more term than the power.',
  next(level){const n=ri(...byLevel(level,[4,8],[4,14],[8,20])),v=level===1?[0,2][ri(0,1)]:ri(0,3);
    if(v===0){const t=ri(2,n);return mcq(`The ${ord(t)} term of an expansion uses r = ?`,String(t-1),[String(t),String(t+1),String(t-2)],`The (r+1)th term uses r, so r = ${t} − 1 = ${t-1}.`)}
    if(v===1){const r=ri(1,n);return mcq(`The term with r = ${r} is the …`,ord(r+1)+' term',[ord(r)+' term',ord(r+2)+' term',ord(r-1<1?r+3:r-1)+' term'],`r + 1 = ${r+1}, so it is the ${ord(r+1)} term.`)}
    if(v===2)return mcq(`How many terms does (a + b)<sup>${n}</sup> have?`,String(n+1),[String(n),String(n+2),String(2*n)],`Always one more than the power: ${n} + 1 = ${n+1}.`);
    const m=2*ri(2,byLevel(level,5,7,10));return mcq(`The middle term of (a + b)<sup>${m}</sup> is the …`,ord(m/2+1)+' term',[ord(m/2)+' term',ord(m/2+2)+' term',ord(m)+' term'],`${m+1} terms, so the middle is number ${m/2+1} (r = ${m/2}).`)}};
