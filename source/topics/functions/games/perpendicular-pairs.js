/* Revision game: Perpendicular pairs. The gradient of a parallel or perpendicular line. */
import {F,fdiv,fstr} from '../../../helpers/fractions.js';
import {fh,sg} from '../../../helpers/maths-display.js';
import {terms,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {typed} from '../../game-helpers.js';

const perpWhy=(m,p)=>`Perpendicular: flip the fraction and change the sign, so ${fh(m)} becomes ${fh(p)}. Check: ${fh(m)} × ${fh(p).startsWith('−')?`(${fh(p)})`:fh(p)} = −1.`;
export const game={id:'fn-perpendicular',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},name:'Perpendicular pairs',icon:'✚',skill:'Parallel and perpendicular gradients',
  how:'Parallel lines have the same gradient. Perpendicular gradients multiply to −1: flip the fraction and change the sign.',
  next(level){
    if(level===3&&Math.random()<.6){  // the line is given as ax + by + d = 0, so find its gradient first
      const a=rnz(-5,5),b=rnz(-5,5),d=rnz(-9,9),m=F(-a,b),p=F(b,a);
      return typed(`Gradient of a line perpendicular to ${terms([[a,'<i>x</i>'],[b,'<i>y</i>'],[d,'']])} = 0?`,sg(fstr(p)),
        `The line has gradient ${fh(m)} (make <i>y</i> the subject). ${perpWhy(m,p)}`)}
    let m;if(level===1)m=F(rnz(-5,5));else{let n,d;do{n=rnz(-5,5);d=ri(2,6)}while(F(n,d).d===1n);m=F(n,d)}
    const p=fdiv(F(-1),m),par=level>1&&Math.random()<.3;
    if(par)return typed(`Line L has gradient ${fh(m)}. Gradient of a line parallel to L?`,sg(fstr(m)),`Parallel lines have the same gradient: ${fh(m)}.`);
    return typed(`Line L has gradient ${fh(m)}. Gradient of a line perpendicular to L?`,sg(fstr(p)),perpWhy(m,p))}};
