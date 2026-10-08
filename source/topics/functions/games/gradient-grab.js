/* Revision game: Gradient grab. The gradient of the line through two points. */
import {F,fstr} from '../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../helpers/maths-display.js';
import {par,pt,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {typed} from '../../game-helpers.js';

export const game={id:'fn-gradient',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},name:'Gradient grab',icon:'📐',skill:'Gradient from two points',
  how:'Change in y ÷ change in x. Subtract in the same order on the top and the bottom.',
  next(level){let x1,y1,x2,y2;
    if(level===1){const m=ri(1,3),dx=ri(1,4);x1=ri(0,4);y1=ri(0,5);x2=x1+dx;y2=y1+m*dx}
    else if(level===2){const m=rnz(-4,4),dx=rnz(-4,4);x1=ri(-5,5);y1=ri(-6,6);x2=x1+dx;y2=y1+m*dx}
    else{do{x1=ri(-6,6);x2=ri(-6,6);y1=ri(-8,8);y2=ri(-8,8)}while(x1===x2||(y2-y1)%(x2-x1)===0)}  // a fraction on the hardest level
    const dy=y2-y1,dx=x2-x1,m=F(dy,dx);
    return typed(`Gradient of the line through ${pt(x1,y1)} and ${pt(x2,y2)}?`,sg(fstr(m)),
      `<i>m</i> = (${val(y2)} ${MINUS} ${par(y1)}) ÷ (${val(x2)} ${MINUS} ${par(x1)}) = ${val(dy)} ÷ ${val(dx)} = ${fh(m)}.`)}};
