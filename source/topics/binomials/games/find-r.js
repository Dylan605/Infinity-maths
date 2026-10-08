/* Revision game: Find r. Which r gives the power of x you want? */
import {xp} from '../../../helpers/maths-display.js';
import {ri} from '../../../helpers/random-numbers.js';
import {typed} from './game-helpers.js';

export const game={id:'findr',syllabus:'SL 1.9',name:'Find r',icon:'🔍',skill:'Finding the right term',
  how:'Set the power of x equal to the one you want, and solve for r.',
  next(level){const hint=t=>level<3?` <span class="mu g-small">(power of x = ${t})</span>`:'';  // no formula on the hardest level
    if(level===1||(level===2&&Math.random()<.5)){const n=2*ri(2,level===1?4:6),r=ri(0,n),k=n-2*r;
      return typed(`In (<i>x</i> + 1/<i>x</i>)<sup>${n}</sup>, which r gives ${xp(k)||'no x'}?${hint(`${n} − 2r`)}`,r,`${n} − 2r = ${k}, so r = ${r}.`)}
    const n=ri(3,9),r=ri(0,n),k=2*n-3*r;
    return typed(`In (<i>x</i>² + 1/<i>x</i>)<sup>${n}</sup>, which r gives ${xp(k)||'no x'}?${hint(`${2*n} − 3r`)}`,r,`${2*n} − 3r = ${k}, so r = ${r}.`)}};
